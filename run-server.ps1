# Simple HTTP Server for Bubu Dudu ki Duniya Restaurant Website
# PowerShell version for Windows

$port = 8000
$currentPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $currentPath

# Check if Python is available
$pythonAvailable = $null
try {
    $pythonAvailable = py -3 --version 2>$null
    if (-not $pythonAvailable) {
        $pythonAvailable = python --version 2>$null
    }
} catch {
    $pythonAvailable = $null
}

if ($pythonAvailable) {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════╗"
    Write-Host "║  Bubu Dudu ki Duniya - Offline Test Server           ║"
    Write-Host "╠═══════════════════════════════════════════════════════╣"
    Write-Host "║  Server running at: http://localhost:${port}             ║"
    Write-Host "║  Press Ctrl+C to stop the server                    ║"
    Write-Host "╚═══════════════════════════════════════════════════════╝"
    Write-Host ""
    
    # Try to open browser
    Start-Process "http://localhost:${port}" -ErrorAction SilentlyContinue
    
    # Start server
    py -3 -m http.server $port
} else {
    Write-Host "Python is not installed or not in PATH."
    Write-Host "Please install Python from https://www.python.org or add it to your PATH."
    Read-Host "Press Enter to exit"
}
