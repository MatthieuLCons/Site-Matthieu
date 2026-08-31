$root = $PSScriptRoot
$port = 8787
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$port/"

$mime = @{
  ".html"        = "text/html; charset=utf-8"
  ".css"         = "text/css; charset=utf-8"
  ".js"          = "application/javascript; charset=utf-8"
  ".png"         = "image/png"
  ".jpg"         = "image/jpeg"
  ".svg"         = "image/svg+xml"
  ".woff2"       = "font/woff2"
  ".txt"         = "text/plain; charset=utf-8"
  ".xml"         = "application/xml"
  ".webmanifest" = "application/manifest+json"
  ".json"        = "application/json"
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $req = $context.Request
  $res = $context.Response
  $path = $req.Url.LocalPath
  if ($path.EndsWith("/")) { $path = $path + "index.html" }
  $filePath = Join-Path $root ($path.TrimStart("/"))
  if (Test-Path $filePath -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($filePath)
    $ct = $mime[$ext]
    if (-not $ct) { $ct = "application/octet-stream" }
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $res.ContentType = $ct
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $res.StatusCode = 404
    $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
    $res.OutputStream.Write($notFound, 0, $notFound.Length)
  }
  $res.OutputStream.Close()
}
