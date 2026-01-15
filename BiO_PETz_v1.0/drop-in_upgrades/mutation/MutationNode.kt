
package mutation

data class MutationNode(
    val id: String,
    val name: String,
    val instabilityCost: Int,
    val unlocked: Boolean = false,
    val children: List<String> = emptyList()
)
