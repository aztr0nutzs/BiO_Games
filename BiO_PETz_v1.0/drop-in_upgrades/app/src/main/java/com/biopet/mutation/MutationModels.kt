
package com.biopet.mutation
import androidx.compose.ui.geometry.Offset

data class MutationNode(
    val id: String,
    val title: String,
    val cost: Int,
    val instabilityGain: Int,
    val corruptionGain: Int,
    val position: Offset,
    val unlocked: Boolean,
    val legendary: Boolean = false
)

data class MutationEdge(val from: String, val to: String)
