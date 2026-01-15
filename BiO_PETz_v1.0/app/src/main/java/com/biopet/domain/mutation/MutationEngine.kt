package com.biopet.domain.mutation
enum class MutationTier{STABLE,UNSTABLE,CORRUPTED,LEGENDARY}
object MutationEngine{
 fun roll(instability:Int):MutationTier =
 when{instability>90->MutationTier.CORRUPTED
 instability>70->MutationTier.UNSTABLE
 else->MutationTier.STABLE}
}