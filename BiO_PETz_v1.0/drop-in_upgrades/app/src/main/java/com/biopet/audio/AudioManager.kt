
package com.biopet.audio
interface AudioManager {
    fun play(id: SoundId)
}
enum class SoundId { TAP, MUTATION, COLLAPSE }
