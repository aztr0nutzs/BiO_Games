
package data

import androidx.room.Dao
import androidx.room.Query
import androidx.room.Insert

@Dao
interface MutationDao {
    @Query("SELECT * FROM MutationEntity")
    suspend fun getAll(): List<MutationEntity>

    @Insert
    suspend fun insert(entity: MutationEntity)
}
