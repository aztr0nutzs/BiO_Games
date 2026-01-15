
package com.biopet.lab
import com.biopet.mutation.*

fun canUnlock(node: MutationNode, state: LabUiState): Boolean {
    if (node.unlocked) return false
    if (state.instability + node.instabilityGain > 100) return false
    if (node.legendary && state.corruption < 30) return false
    return true
}

fun applyMutation(node: MutationNode, state: LabUiState): LabUiState =
    state.copy(
        instability=(state.instability+node.instabilityGain).coerceAtMost(100),
        corruption=(state.corruption+node.corruptionGain).coerceAtMost(100),
        unlockedMutations=state.unlockedMutations+node.id
    )
