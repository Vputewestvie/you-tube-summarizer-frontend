import { NextResponse } from "next/server"
import { Supadata } from "@supadata/js"
import { GoogleGenAI } from "@google/genai"
import { createClient } from '@supabase/supabase-js'

const supadata = new Supadata({
  apiKey: process.env.SUPADATA_API_KEY || "",
})

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "Ссылка на видео обязательна." }, { status: 400 })
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Use service role client to verify user (server-side)
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (userError || !user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Check user credits using service role (bypasses RLS)
    const { data: userData, error: creditsError } = await supabaseAdmin
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (creditsError || !userData || userData.credits <= 0) {
      return NextResponse.json({ error: "Недостаточно кредитов" }, { status: 403 })
    }

    // Decrement credits FIRST (before making external API calls)
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ credits: userData.credits - 1 })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating credits:', updateError)
    }

    // 1. Получение расшифровки через Supadata (бесплатный transcript)
    let transcriptText = ""
    try {
      const response = await supadata.youtube.transcript({
        url,
        text: true,
      })
      if (response && response.content) {
        transcriptText = typeof response.content === "string" 
          ? response.content 
          : response.content.map((chunk: any) => chunk.text || "").join(" ")
      }
    } catch (err: any) {
      return NextResponse.json(
        { error: `Ошибка Supadata: ${err.message || "не удалось получить текст видео"}` },
        { status: 424 }
      )
    }

    if (!transcriptText) {
      return NextResponse.json({ error: "Текст видео пуст или недоступен." }, { status: 422 })
    }

    // 2. Суммаризация через Gemini 3.5 Flash (с переводом на русский)
    let summaryText = ""
    try {
      const promptInput =
        `Ты — профессиональный аналитик видеоконтента. Твоя задача — составить емкую, структурированную сводку на русском языке по предоставленному тексту расшифровки.\n` +
        `Если текст расшифровки на другом языке — сначала переведи его на русский, затем составь сводку.\n` +
        `Ответ должен быть строго отформатирован с использованием синтаксиса Markdown по следующей структуре:\n\n` +
        `## 📌 Главная суть (TL;DR)\n` +
        `(Краткий обзор видео в 2-4 предложениях)\n\n` +
        `## 🔑 Ключевые выводы\n` +
        `*   (Пункт 1 с деталями)\n` +
        `*   (Пункт 2 с деталями)\n` +
        `*   (До 6 важных тезисов)\n\n` +
        `Отвечай строго на русском языке. Опирайся только на факты из текста.\n\n` +
        `Текст расшифровки:\n${transcriptText}`

      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: promptInput,
      })

      summaryText = interaction.output_text || ""
    } catch (err: any) {
      return NextResponse.json(
        { error: `Ошибка Gemini: ${err.message || "ошибка генерации сводки"}` },
        { status: 502 }
      )
    }

    // Save summary to database (using service role to bypass RLS)
    const { error: summaryError } = await supabaseAdmin
      .from('summaries')
      .insert({
        user_id: user.id,
        video_url: url,
      })

    if (summaryError) {
      console.error('Error saving summary:', summaryError)
    }

    return NextResponse.json({ 
      summary: summaryText,
      credits: userData.credits - 1 
    })
  } catch (error: any) {
    return NextResponse.json({ error: "Внутренняя ошибка сервера." }, { status: 500 })
  }
}
