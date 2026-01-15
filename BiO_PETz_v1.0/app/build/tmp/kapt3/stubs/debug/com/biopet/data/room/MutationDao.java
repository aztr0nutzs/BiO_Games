package com.biopet.data.room;

@kotlin.Metadata(mv = {2, 3, 0}, k = 1, xi = 48, d1 = {"\u0000\u001e\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0002\b\u0006\bg\u0018\u00002\u00020\u0001J\u0014\u0010\u0002\u001a\b\u0012\u0004\u0012\u00020\u00040\u0003H\u00a7@\u00a2\u0006\u0002\u0010\u0005J\u0016\u0010\u0006\u001a\u00020\u00072\u0006\u0010\b\u001a\u00020\u0004H\u00a7@\u00a2\u0006\u0002\u0010\tJ\u001c\u0010\n\u001a\u00020\u00072\f\u0010\u000b\u001a\b\u0012\u0004\u0012\u00020\u00040\u0003H\u00a7@\u00a2\u0006\u0002\u0010\f\u00a8\u0006\r\u00c0\u0006\u0003"}, d2 = {"Lcom/biopet/data/room/MutationDao;", "", "getAllMutations", "", "Lcom/biopet/data/room/MutationEntity;", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "insertMutation", "", "mutation", "(Lcom/biopet/data/room/MutationEntity;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "insertMutations", "mutations", "(Ljava/util/List;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
@androidx.room.Dao()
public abstract interface MutationDao {
    
    @androidx.room.Query(value = "SELECT * FROM mutations")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getAllMutations(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.util.List<com.biopet.data.room.MutationEntity>> $completion);
    
    @androidx.room.Insert(onConflict = 1)
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object insertMutation(@org.jetbrains.annotations.NotNull()
    com.biopet.data.room.MutationEntity mutation, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion);
    
    @androidx.room.Insert(onConflict = 1)
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object insertMutations(@org.jetbrains.annotations.NotNull()
    java.util.List<com.biopet.data.room.MutationEntity> mutations, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion);
}