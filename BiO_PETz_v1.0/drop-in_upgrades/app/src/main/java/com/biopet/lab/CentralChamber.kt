package com.biopet.lab

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.*
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import kotlin.random.Random

@Composable
fun CentralChamber(petSpriteRes: Int, instability: Int, corruption: Int) {
    val pulse = rememberInfiniteTransition()
    val scale by pulse.animateFloat(
        initialValue = 0.96f,
        targetValue = 1.04f,
        animationSpec = infiniteRepeatable(
            tween((1600 - instability * 8).coerceAtLeast(400)),
            RepeatMode.Reverse
        )
    )

    Box(
        modifier = Modifier.size(240.dp).graphicsLayer {
            scaleX = scale; scaleY = scale
        },
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            drawCircle(
                brush = Brush.radialGradient(
                    listOf(Color.Cyan.copy(alpha = 0.5f), Color.Transparent)
                ),
                radius = size.minDimension / 2
            )
        }

        Image(
            painter = painterResource(petSpriteRes),
            contentDescription = null,
            modifier = Modifier.size(160.dp)
        )

        if (corruption > 0) CorruptionVeinsOverlay(corruption)
    }
}

@Composable
fun CorruptionVeinsOverlay(corruption: Int) {
    Canvas(
        modifier = Modifier.matchParentSize().alpha((corruption / 100f).coerceAtMost(0.6f))
    ) {
        repeat(corruption / 10) {
            drawLine(
                Color.Red,
                Offset(Random.nextFloat() * size.width, Random.nextFloat() * size.height),
                Offset(Random.nextFloat() * size.width, Random.nextFloat() * size.height),
                2f
            )
        }
    }
}
