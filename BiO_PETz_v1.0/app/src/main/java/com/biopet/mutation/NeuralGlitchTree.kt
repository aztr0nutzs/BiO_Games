
package com.biopet.mutation
import androidx.compose.ui.geometry.Offset

object NeuralGlitchTree {
    val nodes = listOf(
        MutationNode("core","Neural Core",0,0,0,Offset(540f,200f),true),
        MutationNode("synapse","Synapse Overclock",5,8,2,Offset(300f,500f),false),
        MutationNode("ghost","Ghost Latency",8,12,6,Offset(780f,520f),false),
        MutationNode("fracture","Neural Fracture",12,20,15,Offset(540f,820f),false,true)
    )
    val edges = listOf(
        MutationEdge("core","synapse"),
        MutationEdge("core","ghost"),
        MutationEdge("synapse","fracture"),
        MutationEdge("ghost","fracture")
    )
}
