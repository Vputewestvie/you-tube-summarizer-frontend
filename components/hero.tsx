export function Hero() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        Суть любого видео{" "}
        <span className="bg-gradient-to-r from-destructive to-red-500 bg-clip-text text-transparent">
          за секунду!
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
        Вставьте ссылку на ролик с YouTube, чтобы мгновенно получить
        структурированный краткий текст.
      </p>
    </div>
  )
}
