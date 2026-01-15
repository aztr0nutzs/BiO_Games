package com.biopet.domain.mutation

data class MutationNode(
    val id: String,
    val name: String,
    val description: String,
    val tier: MutationTier,
    val instabilityCost: Int,
    val prerequisites: List<String> = emptyList(), // IDs of required nodes
    val isLegendary: Boolean = false,
    val isHidden: Boolean = false, // For ARG
    val state: NodeState = NodeState.LOCKED,
    val corruptionBranches: List<String> = emptyList() // IDs of corruption variants
) {
    enum class NodeState {
        LOCKED,
        UNLOCKED,
        CORRUPTED
    }

    fun canUnlock(unlockedNodes: Set<String>): Boolean {
        return prerequisites.all { it in unlockedNodes }
    }

    fun getEffectiveCost(): Int {
        return when (state) {
            NodeState.CORRUPTED -> instabilityCost * 2 // Corruption costs more
            else -> instabilityCost
        }
    }
}