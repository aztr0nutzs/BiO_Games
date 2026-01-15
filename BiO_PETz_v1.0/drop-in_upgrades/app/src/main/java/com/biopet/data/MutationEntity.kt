
package com.biopet.data
import androidx.room.*

@Entity
data class MutationEntity(
    @PrimaryKey val id: String,
    val unlocked: Boolean
)

@Dao
interface MutationDao {
    @Query("SELECT * FROM MutationEntity")
    suspend fun all(): List<MutationEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entity: MutationEntity)
}

@Database(entities = [MutationEntity::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun mutationDao(): MutationDao
}
