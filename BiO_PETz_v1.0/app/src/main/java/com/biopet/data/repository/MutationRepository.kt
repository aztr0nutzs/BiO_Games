package com.biopet.data.repository

import com.biopet.data.room.BioPetDatabase
import com.biopet.data.room.MutationEntity
import com.biopet.domain.mutation.MutationNode
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOf

class MutationRepository(private val database: BioPetDatabase) {

    suspend fun getMutationStates(): Flow<Map<String, MutationNode.NodeState>> {
        val entities = database.mutationDao().getAllMutations()
        val statesMap = entities.associate { it.id to it.toDomain() }
        return flowOf(statesMap)
    }

    suspend fun saveMutationState(id: String, state: MutationNode.NodeState) {
        database.mutationDao().insertMutation(MutationEntity.fromDomain(id, state))
    }

    suspend fun saveAllMutationStates(states: Map<String, MutationNode.NodeState>) {
        val entities = states.map { MutationEntity.fromDomain(it.key, it.value) }
        database.mutationDao().insertMutations(entities)
    }
}