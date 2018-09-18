<#
@author [Tristan Valcke]{@link https://github.com/Itee}
@license [MIT]{@link https://opensource.org/licenses/MIT}

@description This script will attemp to close gracefully Microsoft Edge tabs then browser itself
#>

$MAX_TRY = 5000
$try = 0
# We need to use force loop because edge process will pop again and again...
do{

    # Close tabs sub process
    $MicrosoftEdgeCPProcess = Get-Process "MicrosoftEdgeCP" -ErrorAction SilentlyContinue
    if( $MicrosoftEdgeCPProcess ) {
        $MicrosoftEdgeCPProcess.CloseMainWindow() | out-null
    }

    # Close Edge browser
    $MicrosoftEdgeProcess = Get-Process "MicrosoftEdge" -ErrorAction SilentlyContinue
    if( $MicrosoftEdgeProcess ) {
        $MicrosoftEdgeProcess.CloseMainWindow() | out-null
    }

    $try++

} while( ( $MicrosoftEdgeCPProcess -or $MicrosoftEdgeProcess ) -and $try -lt $MAX_TRY )

if( $try -eq $MAX_TRY ){
    Write-Output "Unable to close Microsoft Edge browser and child process correctly."
    exit 1
} else {
    exit 0
}

