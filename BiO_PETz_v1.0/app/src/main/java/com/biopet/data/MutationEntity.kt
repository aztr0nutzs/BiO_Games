
package data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity
data class MutationEntity(
    @PrimaryKey val id: String,
    val unlocked: Boolean
)
