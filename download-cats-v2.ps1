$urls = @(
    "https://images.unsplash.com/photo-1561948955-570b270e7c87?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1592194996308-7b43878e84a2?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400&h=400&fit=crop"
)

$outputDir = "public"
$names = @("cat-5.jpg", "cat-6.jpg", "cat-7.jpg", "cat-8.jpg", "cat-10.jpg")

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