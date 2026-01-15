
package com.biopet.corruption
import androidx.compose.runtime.*
import androidx.compose.foundation.layout.*
import androidx.compose.ui.*
import androidx.compose.material3.*
import com.biopet.ui.*

enum class MiniGameResult { SUCCESS, FAIL }

@Composable
fun CorruptionMiniGame(onComplete: (MiniGameResult) -> Unit) {
    var corruption by remember { mutableStateOf(0) }
    Box(Modifier.fillMaxSize().background(NeuralBlack)) {
        Text("Stabilize Signals", color = NeonCyan, modifier = Modifier.align(Alignment.Center))
        if (corruption >= 100) onComplete(MiniGameResult.FAIL)
    }
}
