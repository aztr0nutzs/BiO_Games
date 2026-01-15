package com.biopet.data.room

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [MutationEntity::class], version = 1)
abstract class BioPetDatabase : RoomDatabase() {
    abstract fun mutationDao(): MutationDao
}