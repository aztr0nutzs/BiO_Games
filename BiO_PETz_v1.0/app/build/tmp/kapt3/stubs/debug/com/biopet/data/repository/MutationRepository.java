package com.biopet.data.repository;

@kotlin.Metadata(mv = {2, 3, 0}, k = 1, xi = 48, d1 = {"\u0000.\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\u0010$\n\u0002\u0010\u000e\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0002\b\u0007\u0018\u00002\u00020\u0001B\u000f\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0004\b\u0004\u0010\u0005J \u0010\u0006\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00020\t\u0012\u0004\u0012\u00020\n0\b0\u0007H\u0086@\u00a2\u0006\u0002\u0010\u000bJ\u001e\u0010\f\u001a\u00020\r2\u0006\u0010\u000e\u001a\u00020\t2\u0006\u0010\u000f\u001a\u00020\nH\u0086@\u00a2\u0006\u0002\u0010\u0010J\"\u0010\u0011\u001a\u00020\r2\u0012\u0010\u0012\u001a\u000e\u0012\u0004\u0012\u00020\t\u0012\u0004\u0012\u00020\n0\bH\u0086@\u00a2\u0006\u0002\u0010\u0013R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0014"}, d2 = {"Lcom/biopet/data/repository/MutationRepository;", "", "database", "Lcom/biopet/data/room/BioPetDatabase;", "<init>", "(Lcom/biopet/data/room/BioPetDatabase;)V", "getMutationStates", "Lkotlinx/coroutines/flow/Flow;", "", "", "Lcom/biopet/domain/mutation/MutationNode$NodeState;", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "saveMutationState", "", "id", "state", "(Ljava/lang/String;Lcom/biopet/domain/mutation/MutationNode$NodeState;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "saveAllMutationStates", "states", "(Ljava/util/Map;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
public final class MutationRepository {
    @org.jetbrains.annotations.NotNull()
    private final com.biopet.data.room.BioPetDatabase database = null;
    
    public MutationRepository(@org.jetbrains.annotations.NotNull()
    com.biopet.data.room.BioPetDatabase database) {
        super();
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object getMutationStates(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlinx.coroutines.flow.Flow<? extends java.util.Map<java.lang.String, ? extends com.biopet.domain.mutation.MutationNode.NodeState>>> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object saveMutationState(@org.jetbrains.annotations.NotNull()
    java.lang.String id, @org.jetbrains.annotations.NotNull()
    com.biopet.domain.mutation.MutationNode.NodeState state, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object saveAllMutationStates(@org.jetbrains.annotations.NotNull()
    java.util.Map<java.lang.String, ? extends com.biopet.domain.mutation.MutationNode.NodeState> states, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion) {
        return null;
    }
}