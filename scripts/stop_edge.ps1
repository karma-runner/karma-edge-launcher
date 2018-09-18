<#
@author [Tristan Valcke]{@link https://github.com/Itee}
@license [MIT]{@link https://opensource.org/licenses/MIT}

@description This script will attemp to close gracefully Microsoft Edge tabs then browser itself
#>

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

} while( $MicrosoftEdgeCPProcess -or $MicrosoftEdgeProcess )
