param([string]$url = "")

try {
    $MicrosoftEdgePath = Join-Path $ENV:APPDATA "..\Local\Packages\Microsoft.MicrosoftEdge_8wekyb3d8bbwe" -Resolve -ErrorAction SilentlyContinue
    if ($MicrosoftEdgePath) {
        # Delete Edge's data folder starting from the inner most file
        Get-ChildItem -Path $MicrosoftEdgePath -Force -Recurse |
            Sort-Object -Property FullName -Descending |
            Remove-Item -Recurse -Force
    }

Get-AppXPackage -Name Microsoft.MicrosoftEdge |
    Foreach {
        Add-AppxPackage -DisableDevelopmentMode -Register "$( $_.InstallLocation )\AppXManifest.xml" -Verbose
    }
}
catch
{
    Write-Output "An unexpected error occured while resetting Microsoft Edge."
}

# Start our Microsoft Edge instance
try
{
    Start-Process -FilePath "microsoft-edge:$url"
    Wait-Process -Name "MicrosoftEdge" -ErrorAction Stop
    exit 0
}
catch [ Microsoft.PowerShell.Commands.ProcessCommandException ]
{
    Write-Output "Unable to wait for Microsoft Edge process."
    exit 1
}
catch
{
    Write-Output "An unexpected error occured while starting Microsoft Edge."
    exit 1
}