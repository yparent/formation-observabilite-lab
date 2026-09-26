<#
.SYNOPSIS
  lab.ps1 — le couteau suisse de la formation, version Windows (PowerShell 5.1 ou 7+)

.EXAMPLE
  .\lab.ps1 up            démarre toute la stack
  .\lab.ps1 down          arrête la stack (les données sont conservées)
  .\lab.ps1 reset         arrête ET efface les données
  .\lab.ps1 status        état des conteneurs + URLs
  .\lab.ps1 reload        recharge Prometheus et Alertmanager
  .\lab.ps1 check         valide les fichiers de configuration
  .\lab.ps1 test          tests unitaires des règles
  .\lab.ps1 logs <svc>    logs d'un service
  .\lab.ps1 chaos latency on     (modes : latency | errors | leak, états : on | off)
  .\lab.ps1 chaos cpu 300        brûle du CPU pendant 300 s
  .\lab.ps1 chaos reset
  .\lab.ps1 traffic 20           change le débit (req/s)
  .\lab.ps1 batch                batch Pushgateway
  .\lab.ps1 longterm             Prometheus longue durée (Jour 3)
  .\lab.ps1 snapshot             snapshot TSDB (Jour 3)

.NOTES
  Si PowerShell refuse d'exécuter le script :
    Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
#>
param(
  [Parameter(Position = 0)] [string] $Command = "help",
  [Parameter(Position = 1)] [string] $Arg1,
  [Parameter(Position = 2)] [string] $Arg2
)

Set-Location $PSScriptRoot

function Show-Urls {
  Write-Host ""
  Write-Host "  Prometheus     http://localhost:9090"
  Write-Host "  Grafana        http://localhost:3000   (admin / formation)"
  Write-Host "  Alertmanager   http://localhost:9093"
  Write-Host "  Inbox notifs   http://localhost:8080"
  Write-Host "  shop-api-1     http://localhost:5001   /metrics"
  Write-Host "  shop-api-2     http://localhost:5002   /metrics"
  Write-Host "  Node Exporter  http://localhost:9100   /metrics"
  Write-Host "  Blackbox       http://localhost:9115"
  Write-Host "  Pushgateway    http://localhost:9091"
  Write-Host "  Redis exporter http://localhost:9121   /metrics"
}

function Post($url) { Invoke-RestMethod -Method Post -Uri $url }

switch ($Command) {
  "up"     { docker compose up -d --build; Write-Host "`nStack démarrée. Comptez ~30 s pour que Grafana soit prêt."; Show-Urls }
  "down"   { docker compose --profile "*" down }
  "reset"  { docker compose --profile "*" down -v }
  "status" { docker compose ps; Show-Urls }
  "reload" {
    Post "http://localhost:9090/-/reload" | Out-Null; Write-Host "Prometheus rechargé"
    Post "http://localhost:9093/-/reload" | Out-Null; Write-Host "Alertmanager rechargé"
  }
  "check" {
    docker compose exec prometheus promtool check config /etc/prometheus/prometheus.yml
    docker compose exec alertmanager amtool check-config /etc/alertmanager/alertmanager.yml
  }
  "test"  { docker compose exec prometheus sh -c 'cd /etc/prometheus/tests && promtool test rules *.yml' }
  "logs"  { docker compose logs -f $Arg1 }
  "chaos" {
    $mode = if ($Arg1) { $Arg1 } else { "status" }
    foreach ($port in 5001, 5002) {
      switch ($mode) {
        "cpu"    { $s = if ($Arg2) { $Arg2 } else { 300 }; Post "http://localhost:$port/chaos/cpu?seconds=$s" }
        "reset"  { Post "http://localhost:$port/chaos/reset" }
        "status" { Invoke-RestMethod "http://localhost:$port/chaos/status" }
        default  { $state = if ($Arg2) { $Arg2 } else { "on" }; Post "http://localhost:$port/chaos/$mode/$state" }
      }
    }
  }
  "traffic"  { $env:TRAFFIC_RPS = if ($Arg1) { $Arg1 } else { "6" }; docker compose up -d traffic; Write-Host "Trafic réglé à $env:TRAFFIC_RPS req/s" }
  "batch"    { docker compose --profile batch run --rm batch-job }
  "longterm" { docker compose --profile longterm up -d prometheus-longterm; Write-Host "Prometheus longue durée : http://localhost:9095" }
  "snapshot" { Post "http://localhost:9090/api/v1/admin/tsdb/snapshot" }
  default    { Get-Help $PSCommandPath -Examples }
}
