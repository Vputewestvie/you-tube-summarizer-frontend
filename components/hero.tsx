export function Hero() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        Две умные кошки{" "}
        <span className="bg-gradient-to-r from-blue-500 to-amber-500 bg-clip-text text-transparent">
          посмотрят YouTube за вас!
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
        Алиса и Ксюша сами разберут любое видео. Вставьте ссылку — получите краткую выжимку 
        <span className="hidden sm:inline"> с кошачьими комментариями</span>.
      </p>
    </div>
  )
}
