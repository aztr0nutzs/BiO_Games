
package com.biopet.ui
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.airbnb.lottie.compose.*

@Composable
fun GlitchOverlayLottie(intensity: Int, modifier: Modifier = Modifier) {
    if (intensity < 60) return
    val comp by rememberLottieComposition(LottieCompositionSpec.RawRes(R.raw.glitch_overlay))
    LottieAnimation(comp, modifier = modifier, iterations = LottieConstants.IterateForever)
}
