
package com.biopet.lab

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import com.biopet.ui.theme.DarkPurple
import com.biopet.ui.theme.NeonCyan

@Composable
fun CentralChamber() {
    Box(modifier = Modifier.fillMaxSize()) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            // Draw the central chamber
            drawCircle(
                color = DarkPurple,
                radius = size.minDimension / 2,
                center = center
            )
            // Draw the connection points
            val connectionPoints = listOf(
                Offset(center.x, center.y - size.minDimension / 2),
                Offset(center.x, center.y + size.minDimension / 2),
                Offset(center.x - size.minDimension / 2, center.y),
                Offset(center.x + size.minDimension / 2, center.y)
            )
            connectionPoints.forEach { point ->
                drawCircle(
                    color = NeonCyan,
                    radius = 10f,
                    center = point
                )
            }
        }
    }
}
