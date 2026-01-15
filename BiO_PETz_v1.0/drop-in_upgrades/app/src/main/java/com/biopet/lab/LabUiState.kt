
package com.biopet.lab
data class LabUiState(
    val instability:Int=0,
    val corruption:Int=0,
    val unlockedMutations:Set<String> = emptySet()
)
