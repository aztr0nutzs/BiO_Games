
package com.biopet.mutation

import androidx.compose.runtime.Composable

data class Edge(val startNode: Int, val endNode: Int)

@Composable
fun MutationTreeView(edges: List<Edge>) {
    // This will be the view that displays the mutation tree.
    // We will draw the nodes and the edges connecting them.
}
