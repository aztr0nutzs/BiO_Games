package com.biopet.data.room

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

@Dao
interface MutationDao {
    @Query("SELECT * FROM mutations")
    suspend fun getAllMutations(): List<MutationEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMutation(mutation: MutationEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMutations(mutations: List<MutationEntity>)
}