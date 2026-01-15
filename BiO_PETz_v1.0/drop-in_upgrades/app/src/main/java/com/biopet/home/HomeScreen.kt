
package com.biopet.home
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.material3.*
import com.biopet.ui.*

data class HomeUiState(val instability: Int = 0, val coins: Int = 0)

@Composable
fun HomeScreen(state: HomeUiState) {
    Box(Modifier.fillMaxSize().background(NeuralBlack)) {
        Column {
            Text("bio-Pet", color = NeonCyan, modifier = Modifier.padding(16.dp))
            Box(Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.Center) {
                Text("CENTRAL CHAMBER", color = NeonPurple)
            }
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
                Button(onClick = {}) { Text("Feed") }
                Button(onClick = {}) { Text("Lab") }
                Button(onClick = {}) { Text("Play") }
            }
        }
        GlitchOverlayLottie(state.instability)
    }
}
