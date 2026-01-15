
package com.biopet.mutation
import androidx.compose.runtime.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.*
import androidx.compose.ui.unit.*
import androidx.compose.ui.draw.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.shape.*

@Composable
fun MutationNodeView(node: MutationNode, onClick: () -> Unit) {
    val scale by animateFloatAsState(if (node.unlocked) 1.15f else 1f)
    Box(
        Modifier.offset{IntOffset(node.position.x.toInt(),node.position.y.toInt())}
            .scale(scale)
            .size(76.dp)
            .clip(CircleShape)
            .background(
                when {
                    node.legendary -> Color(0xFFFF1744)
                    node.unlocked -> Color(0xFF00E5FF)
                    else -> Color.DarkGray
                }
            )
            .clickable(enabled=!node.unlocked,onClick=onClick),
        contentAlignment=Alignment.Center
    ){
        Text(node.title, color=Color.White, fontSize=10.sp, textAlign=TextAlign.Center)
    }
}
