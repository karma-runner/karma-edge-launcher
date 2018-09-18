<#
@author [Tristan Valcke]{@link https://github.com/Itee}
@license [MIT]{@link https://opensource.org/licenses/MIT}

@description This script will attemp to start Microsoft Edge browser and wait the process to be detach
#>
param([string]$url = "")

# Check if edge is already running and cancel run if one is found.
$MicrosoftEdgeProcess = Get-Process "MicrosoftEdge" -ErrorAction SilentlyContinue
$MicrosoftEdgeCPProcess = Get-Process "MicrosoftEdgeCP" -ErrorAction SilentlyContinue
if( $MicrosoftEdgeProcess -or $MicrosoftEdgeCPProcess ) {
    Write-Output "An instance of Windows Edge browser is already running. Please close it and try again."
    exit 1
}

# Start our Microsoft Edge instance
try
{
    Start-Process -FilePath "microsoft-edge:$url"
    Wait-Process -Name "MicrosoftEdge" -ErrorAction Stop
}
catch [ Microsoft.PowerShell.Commands.ProcessCommandException ]
{
    Write-Output "Unable to wait for Microsoft Edge process."
    exit 1
}
catch
{
    Write-Output "An unexpected error occure."
    exit 1
}
