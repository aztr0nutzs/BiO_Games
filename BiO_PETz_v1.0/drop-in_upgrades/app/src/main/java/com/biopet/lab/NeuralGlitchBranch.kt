package com.biopet.lab

import androidx.compose.ui.geometry.Offset

object NeuralGlitchBranch {
    val nodes = listOf(
        MutationNode("ng_1","Neural Overclock","Increases reaction speed.",10,8,0,true,false,0,Offset(300f,200f)),
        MutationNode("ng_2","Synaptic Drift","Learning boost with risk.",20,12,5,false,false,1,Offset(500f,350f)),
        MutationNode("ng_3","Cognitive Echo","Autonomous repeats.",30,18,15,false,false,2,Offset(700f,520f)),
        MutationNode("ng_4","Neural Fracture","Forbidden behaviors.",50,30,40,false,false,3,Offset(900f,720f))
    )
}
