# Exercice 1.1 — télécharge et extrait Prometheus et Grafana (binaires Windows) dans install\bin\
# Lancer depuis PowerShell :  .\install\download.ps1
$ErrorActionPreference = "Stop"
$PromVersion = "3.13.3"
$GrafanaVersion = "13.2.1"
Set-Location $PSScriptRoot
New-Item -ItemType Directory -Force -Path bin | Out-Null
Set-Location bin

Write-Host "== Prometheus $PromVersion (windows/amd64)"
Invoke-WebRequest -Uri "https://github.com/prometheus/prometheus/releases/download/v$PromVersion/prometheus-$PromVersion.windows-amd64.zip" -OutFile prometheus.zip
Expand-Archive -Force prometheus.zip . ; Remove-Item prometheus.zip
if (Test-Path prometheus) { Remove-Item -Recurse -Force prometheus }
Rename-Item "prometheus-$PromVersion.windows-amd64" prometheus

Write-Host "== Grafana $GrafanaVersion (windows/amd64)"
Invoke-WebRequest -Uri "https://dl.grafana.com/oss/release/grafana-$GrafanaVersion.windows-amd64.zip" -OutFile grafana.zip
Expand-Archive -Force grafana.zip . ; Remove-Item grafana.zip
if (Test-Path grafana) { Remove-Item -Recurse -Force grafana }
Rename-Item "grafana-$GrafanaVersion" grafana

Write-Host ""
Write-Host "Terminé. Les binaires sont dans install\bin\ :"
Write-Host "  prometheus\prometheus.exe      grafana\bin\grafana.exe"
Write-Host "(pas de Node Exporter sous Windows : l'équivalent est windows_exporter, on le verra en conteneur)"
Write-Host "Suite : voir install\README.md (ou le guide stagiaire, exercice 1.1)."
