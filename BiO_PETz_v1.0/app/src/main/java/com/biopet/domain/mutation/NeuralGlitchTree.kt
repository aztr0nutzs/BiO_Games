package com.biopet.domain.mutation

import kotlin.random.Random

class NeuralGlitchTree {
    private val nodes = mutableMapOf<String, MutationNode>()

    init {
        buildTree()
    }

    private fun buildTree() {
        // Base nodes
        addNode(MutationNode(
            id = "neural_enhance_1",
            name = "Neural Enhancement I",
            description = "Basic neural boost",
            tier = MutationTier.STABLE,
            instabilityCost = 10
        ))

        addNode(MutationNode(
            id = "neural_enhance_2",
            name = "Neural Enhancement II",
            description = "Advanced neural pathways",
            tier = MutationTier.UNSTABLE,
            instabilityCost = 25,
            prerequisites = listOf("neural_enhance_1")
        ))

        addNode(MutationNode(
            id = "glitch_resistance",
            name = "Glitch Resistance",
            description = "Reduce corruption risk",
            tier = MutationTier.STABLE,
            instabilityCost = 15,
            prerequisites = listOf("neural_enhance_1")
        ))

        // Corruption branch
        addNode(MutationNode(
            id = "neural_glitch",
            name = "Neural Glitch",
            description = "Unstable neural feedback",
            tier = MutationTier.CORRUPTED,
            instabilityCost = 40,
            prerequisites = listOf("neural_enhance_2"),
            corruptionBranches = listOf("neural_glitch_alpha", "neural_glitch_beta")
        ))

        addNode(MutationNode(
            id = "neural_glitch_alpha",
            name = "Neural Glitch Alpha",
            description = "Corrupted alpha variant",
            tier = MutationTier.CORRUPTED,
            instabilityCost = 50,
            prerequisites = listOf("neural_glitch"),
            isLegendary = true
        ))

        addNode(MutationNode(
            id = "neural_glitch_beta",
            name = "Neural Glitch Beta",
            description = "Corrupted beta variant",
            tier = MutationTier.CORRUPTED,
            instabilityCost = 50,
            prerequisites = listOf("neural_glitch"),
            isLegendary = true
        ))

        // Hidden ARG node
        addNode(MutationNode(
            id = "hidden_evolution",
            name = "Hidden Evolution",
            description = "Mysterious transformation",
            tier = MutationTier.LEGENDARY,
            instabilityCost = 100,
            isHidden = true,
            isLegendary = true
        ))
    }

    private fun addNode(node: MutationNode) {
        nodes[node.id] = node
    }

    fun getNode(id: String): MutationNode? = nodes[id]

    fun getAllNodes(): Map<String, MutationNode> = nodes.toMap()

    fun getUnlockedNodes(currentUnlocked: Set<String>): List<MutationNode> {
        return nodes.values.filter { it.canUnlock(currentUnlocked) && it.state == MutationNode.NodeState.LOCKED }
    }

    fun applyMutation(nodeId: String, currentInstability: Int): MutationResult {
        val node = nodes[nodeId] ?: return MutationResult.Failure("Node not found")

        if (node.state != MutationNode.NodeState.UNLOCKED) {
            return MutationResult.Failure("Node not unlocked")
        }

        val cost = node.getEffectiveCost()
        if (currentInstability < cost) {
            return MutationResult.Failure("Insufficient instability")
        }

        val roll = MutationEngine.roll(currentInstability)
        val newState = when (roll) {
            MutationTier.CORRUPTED -> MutationNode.NodeState.CORRUPTED
            else -> MutationNode.NodeState.UNLOCKED
        }

        nodes[nodeId] = node.copy(state = newState)

        return MutationResult.Success(newState, roll, cost)
    }

    fun unlockNode(nodeId: String): Boolean {
        val node = nodes[nodeId] ?: return false
        if (node.state != MutationNode.NodeState.LOCKED) return false
        nodes[nodeId] = node.copy(state = MutationNode.NodeState.UNLOCKED)
        return true
    }

    // ARG trigger: based on time, instability, behavior
    fun checkHiddenTriggers(instability: Int, sessionTime: Long, tapCount: Int): List<String> {
        val triggered = mutableListOf<String>()

        // Example: High instability + long session + many taps
        if (instability > 80 && sessionTime > 3600000 && tapCount > 100) { // 1 hour
            if (Random.nextFloat() < 0.1f) { // 10% chance
                triggered.add("hidden_evolution")
            }
        }

        return triggered
    }

    sealed class MutationResult {
        data class Success(val newState: MutationNode.NodeState, val tier: MutationTier, val cost: Int) : MutationResult()
        data class Failure(val reason: String) : MutationResult()
    }
}