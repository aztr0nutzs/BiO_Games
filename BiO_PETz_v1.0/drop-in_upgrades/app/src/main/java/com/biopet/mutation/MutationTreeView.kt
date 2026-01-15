
package com.biopet.mutation
import androidx.compose.runtime.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.*
import androidx.compose.ui.unit.*
import androidx.compose.animation.core.*

@Composable
fun MutationTreeView(
    nodes: List<MutationNode>,
    edges: List<MutationEdge>,
    instability: Int,
    onMutate: (MutationNode) -> Unit
) {
    Box(Modifier.fillMaxSize()) {
        MutationEdgesCanvas(nodes, edges)
        nodes.forEach { MutationNodeView(it) { onMutate(it) } }
        if (instability >= 70) GlitchOverlay()
    }
}
