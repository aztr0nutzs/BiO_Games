package com.biopet.lab

import androidx.compose.ui.geometry.Offset

data class LabUiState(
    val petSpriteRes: Int,
    val instability: Int,
    val corruption: Int,
    val nodes: List<MutationNode>,
    val connections: List<MutationConnection>,
    val isRollbackAvailable: Boolean,
    val showGlitchOverlay: Boolean,
    val isApplyingMutation: Boolean,
    val availableNeuralPoints: Int
)

data class MutationNode(
    val id: String,
    val name: String,
    val description: String,
    val cost: Int,
    val instabilityDelta: Int,
    val corruptionRisk: Int,
    val isUnlocked: Boolean,
    val isApplied: Boolean,
    val tier: Int,
    val position: Offset
)

data class MutationConnection(
    val from: Offset,
    val to: Offset,
    val severity: Float
)
