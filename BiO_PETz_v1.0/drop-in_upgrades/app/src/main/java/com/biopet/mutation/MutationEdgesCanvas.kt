
package com.biopet.mutation
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.*
import androidx.compose.ui.Modifier
import androidx.compose.foundation.Canvas
import androidx.compose.ui.geometry.*
import androidx.compose.animation.core.*

@Composable
fun MutationEdgesCanvas(nodes: List<MutationNode>, edges: List<MutationEdge>) {
    val nodeMap = nodes.associateBy { it.id }
    val t = rememberInfiniteTransition()
    val p by t.animateFloat(0.3f,1f,infiniteRepeatable(tween(2600)))

    Canvas(Modifier.fillMaxSize()) {
        edges.forEach {
            val a = nodeMap[it.from]?.position ?: return@forEach
            val b = nodeMap[it.to]?.position ?: return@forEach
            val path = Path().apply {
                moveTo(a.x,a.y)
                cubicTo(a.x,(a.y+b.y)/2,b.x,(a.y+b.y)/2,b.x,b.y)
            }
            val m = PathMeasure()
            m.setPath(path,false)
            val d = Path()
            m.getSegment(0f,m.length*p,d,true)
            drawPath(d, Color.Cyan, style = Stroke(6f,cap=StrokeCap.Round))
        }
    }
}
