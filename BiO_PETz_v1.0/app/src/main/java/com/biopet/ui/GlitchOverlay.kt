
package com.biopet.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color

@Composable
fun GlitchOverlay(intensity: Int, modifier: Modifier = Modifier) {
    if (intensity < 60) return
    Box(modifier = modifier.fillMaxSize().background(Color(0x80FF0000))) // Semi-transparent red
}
