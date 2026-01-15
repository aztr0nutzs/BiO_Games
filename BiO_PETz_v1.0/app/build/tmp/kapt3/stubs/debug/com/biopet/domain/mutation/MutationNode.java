package com.biopet.domain.mutation;

@kotlin.Metadata(mv = {2, 3, 0}, k = 1, xi = 48, d1 = {"\u0000<\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0010 \n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0013\n\u0002\u0010\"\n\u0002\b\u0012\b\u0086\b\u0018\u00002\u00020\u0001:\u00015Bm\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0003\u0012\u0006\u0010\u0005\u001a\u00020\u0003\u0012\u0006\u0010\u0006\u001a\u00020\u0007\u0012\u0006\u0010\b\u001a\u00020\t\u0012\u000e\b\u0002\u0010\n\u001a\b\u0012\u0004\u0012\u00020\u00030\u000b\u0012\b\b\u0002\u0010\f\u001a\u00020\r\u0012\b\b\u0002\u0010\u000e\u001a\u00020\r\u0012\b\b\u0002\u0010\u000f\u001a\u00020\u0010\u0012\u000e\b\u0002\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\u00030\u000b\u00a2\u0006\u0004\b\u0012\u0010\u0013J\u0014\u0010\"\u001a\u00020\r2\f\u0010#\u001a\b\u0012\u0004\u0012\u00020\u00030$J\u0006\u0010%\u001a\u00020\tJ\t\u0010&\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\'\u001a\u00020\u0003H\u00c6\u0003J\t\u0010(\u001a\u00020\u0003H\u00c6\u0003J\t\u0010)\u001a\u00020\u0007H\u00c6\u0003J\t\u0010*\u001a\u00020\tH\u00c6\u0003J\u000f\u0010+\u001a\b\u0012\u0004\u0012\u00020\u00030\u000bH\u00c6\u0003J\t\u0010,\u001a\u00020\rH\u00c6\u0003J\t\u0010-\u001a\u00020\rH\u00c6\u0003J\t\u0010.\u001a\u00020\u0010H\u00c6\u0003J\u000f\u0010/\u001a\b\u0012\u0004\u0012\u00020\u00030\u000bH\u00c6\u0003Jy\u00100\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u00032\b\b\u0002\u0010\u0005\u001a\u00020\u00032\b\b\u0002\u0010\u0006\u001a\u00020\u00072\b\b\u0002\u0010\b\u001a\u00020\t2\u000e\b\u0002\u0010\n\u001a\b\u0012\u0004\u0012\u00020\u00030\u000b2\b\b\u0002\u0010\f\u001a\u00020\r2\b\b\u0002\u0010\u000e\u001a\u00020\r2\b\b\u0002\u0010\u000f\u001a\u00020\u00102\u000e\b\u0002\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\u00030\u000bH\u00c6\u0001J\u0014\u00101\u001a\u00020\r2\b\u00102\u001a\u0004\u0018\u00010\u0001H\u00d6\u0083\u0004J\n\u00103\u001a\u00020\tH\u00d6\u0081\u0004J\n\u00104\u001a\u00020\u0003H\u00d6\u0081\u0004R\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0014\u0010\u0015R\u0011\u0010\u0004\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0016\u0010\u0015R\u0011\u0010\u0005\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0017\u0010\u0015R\u0011\u0010\u0006\u001a\u00020\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0018\u0010\u0019R\u0011\u0010\b\u001a\u00020\t\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001a\u0010\u001bR\u0017\u0010\n\u001a\b\u0012\u0004\u0012\u00020\u00030\u000b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001c\u0010\u001dR\u0011\u0010\f\u001a\u00020\r\u00a2\u0006\b\n\u0000\u001a\u0004\b\f\u0010\u001eR\u0011\u0010\u000e\u001a\u00020\r\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\u001eR\u0011\u0010\u000f\u001a\u00020\u0010\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001f\u0010 R\u0017\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\u00030\u000b\u00a2\u0006\b\n\u0000\u001a\u0004\b!\u0010\u001d\u00a8\u00066"}, d2 = {"Lcom/biopet/domain/mutation/MutationNode;", "", "id", "", "name", "description", "tier", "Lcom/biopet/domain/mutation/MutationTier;", "instabilityCost", "", "prerequisites", "", "isLegendary", "", "isHidden", "state", "Lcom/biopet/domain/mutation/MutationNode$NodeState;", "corruptionBranches", "<init>", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lcom/biopet/domain/mutation/MutationTier;ILjava/util/List;ZZLcom/biopet/domain/mutation/MutationNode$NodeState;Ljava/util/List;)V", "getId", "()Ljava/lang/String;", "getName", "getDescription", "getTier", "()Lcom/biopet/domain/mutation/MutationTier;", "getInstabilityCost", "()I", "getPrerequisites", "()Ljava/util/List;", "()Z", "getState", "()Lcom/biopet/domain/mutation/MutationNode$NodeState;", "getCorruptionBranches", "canUnlock", "unlockedNodes", "", "getEffectiveCost", "component1", "component2", "component3", "component4", "component5", "component6", "component7", "component8", "component9", "component10", "copy", "equals", "other", "hashCode", "toString", "NodeState", "app_debug"})
public final class MutationNode {
    @org.jetbrains.annotations.NotNull()
    private final java.lang.String id = null;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.String name = null;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.String description = null;
    @org.jetbrains.annotations.NotNull()
    private final com.biopet.domain.mutation.MutationTier tier = null;
    private final int instabilityCost = 0;
    @org.jetbrains.annotations.NotNull()
    private final java.util.List<java.lang.String> prerequisites = null;
    private final boolean isLegendary = false;
    private final boolean isHidden = false;
    @org.jetbrains.annotations.NotNull()
    private final com.biopet.domain.mutation.MutationNode.NodeState state = null;
    @org.jetbrains.annotations.NotNull()
    private final java.util.List<java.lang.String> corruptionBranches = null;
    
    public MutationNode(@org.jetbrains.annotations.NotNull()
    java.lang.String id, @org.jetbrains.annotations.NotNull()
    java.lang.String name, @org.jetbrains.annotations.NotNull()
    java.lang.String description, @org.jetbrains.annotations.NotNull()
    com.biopet.domain.mutation.MutationTier tier, int instabilityCost, @org.jetbrains.annotations.NotNull()
    java.util.List<java.lang.String> prerequisites, boolean isLegendary, boolean isHidden, @org.jetbrains.annotations.NotNull()
    com.biopet.domain.mutation.MutationNode.NodeState state, @org.jetbrains.annotations.NotNull()
    java.util.List<java.lang.String> corruptionBranches) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String getId() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String getName() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String getDescription() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.biopet.domain.mutation.MutationTier getTier() {
        return null;
    }
    
    public final int getInstabilityCost() {
        return 0;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<java.lang.String> getPrerequisites() {
        return null;
    }
    
    public final boolean isLegendary() {
        return false;
    }
    
    public final boolean isHidden() {
        return false;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.biopet.domain.mutation.MutationNode.NodeState getState() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<java.lang.String> getCorruptionBranches() {
        return null;
    }
    
    public final boolean canUnlock(@org.jetbrains.annotations.NotNull()
    java.util.Set<java.lang.String> unlockedNodes) {
        return false;
    }
    
    public final int getEffectiveCost() {
        return 0;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String component1() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<java.lang.String> component10() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String component2() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.lang.String component3() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.biopet.domain.mutation.MutationTier component4() {
        return null;
    }
    
    public final int component5() {
        return 0;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<java.lang.String> component6() {
        return null;
    }
    
    public final boolean component7() {
        return false;
    }
    
    public final boolean component8() {
        return false;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.biopet.domain.mutation.MutationNode.NodeState component9() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.biopet.domain.mutation.MutationNode copy(@org.jetbrains.annotations.NotNull()
    java.lang.String id, @org.jetbrains.annotations.NotNull()
    java.lang.String name, @org.jetbrains.annotations.NotNull()
    java.lang.String description, @org.jetbrains.annotations.NotNull()
    com.biopet.domain.mutation.MutationTier tier, int instabilityCost, @org.jetbrains.annotations.NotNull()
    java.util.List<java.lang.String> prerequisites, boolean isLegendary, boolean isHidden, @org.jetbrains.annotations.NotNull()
    com.biopet.domain.mutation.MutationNode.NodeState state, @org.jetbrains.annotations.NotNull()
    java.util.List<java.lang.String> corruptionBranches) {
        return null;
    }
    
    @java.lang.Override()
    public boolean equals(@org.jetbrains.annotations.Nullable()
    java.lang.Object other) {
        return false;
    }
    
    @java.lang.Override()
    public int hashCode() {
        return 0;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.NotNull()
    public java.lang.String toString() {
        return null;
    }
    
    @kotlin.Metadata(mv = {2, 3, 0}, k = 1, xi = 48, d1 = {"\u0000\f\n\u0002\u0018\u0002\n\u0002\u0010\u0010\n\u0002\b\u0006\b\u0086\u0081\u0002\u0018\u00002\b\u0012\u0004\u0012\u00020\u00000\u0001B\t\b\u0002\u00a2\u0006\u0004\b\u0002\u0010\u0003j\u0002\b\u0004j\u0002\b\u0005j\u0002\b\u0006\u00a8\u0006\u0007"}, d2 = {"Lcom/biopet/domain/mutation/MutationNode$NodeState;", "", "<init>", "(Ljava/lang/String;I)V", "LOCKED", "UNLOCKED", "CORRUPTED", "app_debug"})
    public static enum NodeState {
        /*public static final*/ LOCKED /* = new LOCKED() */,
        /*public static final*/ UNLOCKED /* = new UNLOCKED() */,
        /*public static final*/ CORRUPTED /* = new CORRUPTED() */;
        
        NodeState() {
        }
        
        @org.jetbrains.annotations.NotNull()
        public static kotlin.enums.EnumEntries<com.biopet.domain.mutation.MutationNode.NodeState> getEntries() {
            return null;
        }
    }
}