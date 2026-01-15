
package com.biopet.lab
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.material3.*
import com.biopet.mutation.*
import com.biopet.ui.*

@Composable
fun LabScreen(state: LabUiState) {
    Box(Modifier.fillMaxSize().background(NeuralBlack)) {
        Column {
            Text("Mutation Lab", color = NeonCyan, modifier = Modifier.padding(16.dp))
            MutationTreeView(state.nodes, state.edges)
        }
        GlitchOverlayLottie(state.instability)
    }
}
