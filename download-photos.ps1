# Karate Strassen – Téléchargement photos Unsplash
# Lance depuis PowerShell dans le dossier du projet :
#   .\download-photos.ps1

$key = "cJyThwMme6leUz6J4H11m5fRXvAexQ2er12AD1Mzp2Q"
$dest = "assets\images"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$photos = @{
    "karate-dojo-tatami"         = "karate dojo tatami"
    "karate-entrainement-dojo"   = "karate training"
    "karate-kata-competition"    = "karate kata competition"
    "karate-kumite-combat"       = "karate kumite fight"
    "karate-enfants-cours"       = "children karate class"
    "karate-ceinture-noire"      = "karate black belt"
}

foreach ($name in $photos.Keys) {
    $query = [uri]::EscapeDataString($photos[$name])
    $url   = "https://api.unsplash.com/search/photos?query=$query&orientation=landscape&per_page=1&client_id=$key"
    Write-Host "→ $name ..." -NoNewline
    try {
        $res     = Invoke-RestMethod -Uri $url -Method Get
        $imgUrl  = $res.results[0].urls.raw + "&w=1600&fit=crop&auto=format&q=80"
        Invoke-WebRequest -Uri $imgUrl -OutFile "$dest\$name.jpg" -UseBasicParsing
        Write-Host " ✓" -ForegroundColor Green
    } catch {
        Write-Host " ✗ $_" -ForegroundColor Red
    }
}

Write-Host "`n✅ Photos dans $dest\" -ForegroundColor Cyan
