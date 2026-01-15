package com.biopet.data.room

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.biopet.domain.mutation.MutationNode

@Entity(tableName = "mutations")
data class MutationEntity(
    @PrimaryKey val id: String,
    val state: String // LOCKED, UNLOCKED, CORRUPTED
) {
    fun toDomain(): MutationNode.NodeState = when (state) {
        "UNLOCKED" -> MutationNode.NodeState.UNLOCKED
        "CORRUPTED" -> MutationNode.NodeState.CORRUPTED
        else -> MutationNode.NodeState.LOCKED
    }

    companion object {
        fun fromDomain(id: String, state: MutationNode.NodeState): MutationEntity {
            return MutationEntity(id, state.name)
        }
    }
}