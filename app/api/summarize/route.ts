import { NextResponse } from "next/server"
import { Supadata } from "@supadata/js"
import { GoogleGenAI } from "@google/genai"

const supadata = new Supadata({
  apiKey: process.env.SUPADATA_API_KEY || "",
})

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
})

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "Ссылка на видео обязательна." }, { status: 400 })
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

    return NextResponse.json({ summary: summaryText })
  } catch (error: any) {
    return NextResponse.json({ error: "Внутренняя ошибка сервера." }, { status: 500 })
  }
}