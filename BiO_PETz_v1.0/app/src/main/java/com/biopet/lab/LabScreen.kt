
package com.biopet.lab

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.biopet.mutation. MutationTreeView
import com.biopet.ui.theme.NeuralBlack

@Composable
fun LabScreen(navController: NavController) {
    Box(modifier = Modifier.fillMaxSize().background(NeuralBlack).padding(16.dp)) {
        CentralChamber()
        MutationTreeView(edges = emptyList())
    }
}
