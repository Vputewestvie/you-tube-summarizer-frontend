$urls = @(
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefcf1?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1495360019602-e0019203f7b2?w=400&h=400&fit=crop"
)

$outputDir = "public"
$names = @("cat-2.jpg", "cat-3.jpg", "cat-4.jpg", "cat-5.jpg", "cat-6.jpg")

for ($i = 0; $i -lt $urls.Count; $i++) {
    $outputPath = Join-Path $outputDir $names[$i]
    Write-Host "Downloading $($urls[$i]) to $outputPath"
    Invoke-WebRequest -Uri $urls[$i] -OutFile $outputPath -UseBasicParsing
    Write-Host "Downloaded $($names[$i])"
}

Write-Host "All downloads complete!"