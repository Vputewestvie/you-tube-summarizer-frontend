$urls = @(
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefcf1?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1495360019602-e0019203f7b2?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1543852786-1a6624e96c68?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1519052537078-e6302a4968ef?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop"
)

$outputDir = "public"
$names = @("cat-5.jpg", "cat-6.jpg", "cat-7.jpg", "cat-8.jpg", "cat-9.jpg")

for ($i = 0; $i -lt $urls.Count; $i++) {
    $outputPath = Join-Path $outputDir $names[$i]
    Write-Host "Downloading $($urls[$i]) to $outputPath"
    try {
        Invoke-WebRequest -Uri $urls[$i] -OutFile $outputPath -UseBasicParsing
        Write-Host "Downloaded $($names[$i])"
    } catch {
        Write-Host "Failed to download $($names[$i]): $_"
    }
}

Write-Host "All downloads complete!"