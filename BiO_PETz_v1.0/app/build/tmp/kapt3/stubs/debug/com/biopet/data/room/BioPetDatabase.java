package com.biopet.data.room;

@kotlin.Metadata(mv = {2, 3, 0}, k = 1, xi = 48, d1 = {"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\b\'\u0018\u00002\u00020\u0001B\u0007\u00a2\u0006\u0004\b\u0002\u0010\u0003J\b\u0010\u0004\u001a\u00020\u0005H&\u00a8\u0006\u0006"}, d2 = {"Lcom/biopet/data/room/BioPetDatabase;", "Landroidx/room/RoomDatabase;", "<init>", "()V", "mutationDao", "Lcom/biopet/data/room/MutationDao;", "app_debug"})
@androidx.room.Database(entities = {com.biopet.data.room.MutationEntity.class}, version = 1)
public abstract class BioPetDatabase extends androidx.room.RoomDatabase {
    
    public BioPetDatabase() {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public abstract com.biopet.data.room.MutationDao mutationDao();
}