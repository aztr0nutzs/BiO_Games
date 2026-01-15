
package com.biopet.home
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.biopet.ui.theme.DarkPurple
import com.biopet.ui.theme.NeonCyan

@Composable
fun HomeScreen(navController: NavController) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        PetriDish()
    }
}

@Composable
fun PetriDish() {
    Canvas(modifier = Modifier.size(300.dp)) {
        drawCircle(
            color = DarkPurple,
            radius = size.minDimension / 2,
            style = Stroke(width = 10f)
        )
        drawCircle(
            color = NeonCyan,
            radius = size.minDimension / 2 - 20f,
            style = Stroke(width = 5f)
        )
    }
}
