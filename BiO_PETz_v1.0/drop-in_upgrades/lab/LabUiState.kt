
package lab

data class LabUiState(
    val instability: Int = 0,
    val activeMutations: List<String> = emptyList(),
    val corruptionLevel: Float = 0f
)
