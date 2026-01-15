package com.biopet.domain.mutation;

@kotlin.Metadata(mv = {2, 3, 0}, k = 1, xi = 48, d1 = {"\u0000R\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0010%\n\u0002\u0010\u000e\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0005\n\u0002\u0010$\n\u0000\n\u0002\u0010 \n\u0000\n\u0002\u0010\"\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0003\n\u0002\u0010\t\n\u0002\b\u0003\u0018\u00002\u00020\u0001:\u0001 B\u0007\u00a2\u0006\u0004\b\u0002\u0010\u0003J\b\u0010\b\u001a\u00020\tH\u0002J\u0010\u0010\n\u001a\u00020\t2\u0006\u0010\u000b\u001a\u00020\u0007H\u0002J\u0010\u0010\f\u001a\u0004\u0018\u00010\u00072\u0006\u0010\r\u001a\u00020\u0006J\u0012\u0010\u000e\u001a\u000e\u0012\u0004\u0012\u00020\u0006\u0012\u0004\u0012\u00020\u00070\u000fJ\u001a\u0010\u0010\u001a\b\u0012\u0004\u0012\u00020\u00070\u00112\f\u0010\u0012\u001a\b\u0012\u0004\u0012\u00020\u00060\u0013J\u0016\u0010\u0014\u001a\u00020\u00152\u0006\u0010\u0016\u001a\u00020\u00062\u0006\u0010\u0017\u001a\u00020\u0018J\u000e\u0010\u0019\u001a\u00020\u001a2\u0006\u0010\u0016\u001a\u00020\u0006J$\u0010\u001b\u001a\b\u0012\u0004\u0012\u00020\u00060\u00112\u0006\u0010\u001c\u001a\u00020\u00182\u0006\u0010\u001d\u001a\u00020\u001e2\u0006\u0010\u001f\u001a\u00020\u0018R\u001a\u0010\u0004\u001a\u000e\u0012\u0004\u0012\u00020\u0006\u0012\u0004\u0012\u00020\u00070\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006!"}, d2 = {"Lcom/biopet/domain/mutation/NeuralGlitchTree;", "", "<init>", "()V", "nodes", "", "", "Lcom/biopet/domain/mutation/MutationNode;", "buildTree", "", "addNode", "node", "getNode", "id", "getAllNodes", "", "getUnlockedNodes", "", "currentUnlocked", "", "applyMutation", "Lcom/biopet/domain/mutation/NeuralGlitchTree$MutationResult;", "nodeId", "currentInstability", "", "unlockNode", "", "checkHiddenTriggers", "instability", "sessionTime", "", "tapCount", "MutationResult", "app_debug"})
public final class NeuralGlitchTree {
    @org.jetbrains.annotations.NotNull()
    private final java.util.Map<java.lang.String, com.biopet.domain.mutation.MutationNode> nodes = null;
    
    public NeuralGlitchTree() {
        super();
    }
    
    private final void buildTree() {
    }
    
    private final void addNode(com.biopet.domain.mutation.MutationNode node) {
    }
    
    @org.jetbrains.annotations.Nullable()
    public final com.biopet.domain.mutation.MutationNode getNode(@org.jetbrains.annotations.NotNull()
    java.lang.String id) {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.Map<java.lang.String, com.biopet.domain.mutation.MutationNode> getAllNodes() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.biopet.domain.mutation.MutationNode> getUnlockedNodes(@org.jetbrains.annotations.NotNull()
    java.util.Set<java.lang.String> currentUnlocked) {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.biopet.domain.mutation.NeuralGlitchTree.MutationResult applyMutation(@org.jetbrains.annotations.NotNull()
    java.lang.String nodeId, int currentInstability) {
        return null;
    }
    
    public final boolean unlockNode(@org.jetbrains.annotations.NotNull()
    java.lang.String nodeId) {
        return false;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<java.lang.String> checkHiddenTriggers(int instability, long sessionTime, int tapCount) {
        return null;
    }
    
    @kotlin.Metadata(mv = {2, 3, 0}, k = 1, xi = 48, d1 = {"\u0000\u0016\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\b6\u0018\u00002\u00020\u0001:\u0002\u0004\u0005B\t\b\u0004\u00a2\u0006\u0004\b\u0002\u0010\u0003\u0082\u0001\u0002\u0006\u0007\u00a8\u0006\b"}, d2 = {"Lcom/biopet/domain/mutation/NeuralGlitchTree$MutationResult;", "", "<init>", "()V", "Success", "Failure", "Lcom/biopet/domain/mutation/NeuralGlitchTree$MutationResult$Failure;", "Lcom/biopet/domain/mutation/NeuralGlitchTree$MutationResult$Success;", "app_debug"})
    public static abstract class MutationResult {
        
        private MutationResult() {
            super();
        }
        
        @kotlin.Metadata(mv = {2, 3, 0}, k = 1, xi = 48, d1 = {"\u0000&\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0007\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\b\n\u0002\b\u0002\b\u0086\b\u0018\u00002\u00020\u0001B\u000f\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0004\b\u0004\u0010\u0005J\t\u0010\b\u001a\u00020\u0003H\u00c6\u0003J\u0013\u0010\t\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u0003H\u00c6\u0001J\u0014\u0010\n\u001a\u00020\u000b2\b\u0010\f\u001a\u0004\u0018\u00010\rH\u00d6\u0083\u0004J\n\u0010\u000e\u001a\u00020\u000fH\u00d6\u0081\u0004J\n\u0010\u0010\u001a\u00020\u0003H\u00d6\u0081\u0004R\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0006\u0010\u0007\u00a8\u0006\u0011"}, d2 = {"Lcom/biopet/domain/mutation/NeuralGlitchTree$MutationResult$Failure;", "Lcom/biopet/domain/mutation/NeuralGlitchTree$MutationResult;", "reason", "", "<init>", "(Ljava/lang/String;)V", "getReason", "()Ljava/lang/String;", "component1", "copy", "equals", "", "other", "", "hashCode", "", "toString", "app_debug"})
        public static final class Failure extends com.biopet.domain.mutation.NeuralGlitchTree.MutationResult {
            @org.jetbrains.annotations.NotNull()
            private final java.lang.String reason = null;
            
            public Failure(@org.jetbrains.annotations.NotNull()
            java.lang.String reason) {
            }
            
            @org.jetbrains.annotations.NotNull()
            public final java.lang.String getReason() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull()
            public final java.lang.String component1() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull()
            public final com.biopet.domain.mutation.NeuralGlitchTree.MutationResult.Failure copy(@org.jetbrains.annotations.NotNull()
            java.lang.String reason) {
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
        }
        
        @kotlin.Metadata(mv = {2, 3, 0}, k = 1, xi = 48, d1 = {"\u00002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\r\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\b\u0086\b\u0018\u00002\u00020\u0001B\u001f\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u0012\u0006\u0010\u0006\u001a\u00020\u0007\u00a2\u0006\u0004\b\b\u0010\tJ\t\u0010\u0010\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u0011\u001a\u00020\u0005H\u00c6\u0003J\t\u0010\u0012\u001a\u00020\u0007H\u00c6\u0003J\'\u0010\u0013\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u00052\b\b\u0002\u0010\u0006\u001a\u00020\u0007H\u00c6\u0001J\u0014\u0010\u0014\u001a\u00020\u00152\b\u0010\u0016\u001a\u0004\u0018\u00010\u0017H\u00d6\u0083\u0004J\n\u0010\u0018\u001a\u00020\u0007H\u00d6\u0081\u0004J\n\u0010\u0019\u001a\u00020\u001aH\u00d6\u0081\u0004R\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\n\u0010\u000bR\u0011\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\f\u0010\rR\u0011\u0010\u0006\u001a\u00020\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\u000f\u00a8\u0006\u001b"}, d2 = {"Lcom/biopet/domain/mutation/NeuralGlitchTree$MutationResult$Success;", "Lcom/biopet/domain/mutation/NeuralGlitchTree$MutationResult;", "newState", "Lcom/biopet/domain/mutation/MutationNode$NodeState;", "tier", "Lcom/biopet/domain/mutation/MutationTier;", "cost", "", "<init>", "(Lcom/biopet/domain/mutation/MutationNode$NodeState;Lcom/biopet/domain/mutation/MutationTier;I)V", "getNewState", "()Lcom/biopet/domain/mutation/MutationNode$NodeState;", "getTier", "()Lcom/biopet/domain/mutation/MutationTier;", "getCost", "()I", "component1", "component2", "component3", "copy", "equals", "", "other", "", "hashCode", "toString", "", "app_debug"})
        public static final class Success extends com.biopet.domain.mutation.NeuralGlitchTree.MutationResult {
            @org.jetbrains.annotations.NotNull()
            private final com.biopet.domain.mutation.MutationNode.NodeState newState = null;
            @org.jetbrains.annotations.NotNull()
            private final com.biopet.domain.mutation.MutationTier tier = null;
            private final int cost = 0;
            
            public Success(@org.jetbrains.annotations.NotNull()
            com.biopet.domain.mutation.MutationNode.NodeState newState, @org.jetbrains.annotations.NotNull()
            com.biopet.domain.mutation.MutationTier tier, int cost) {
            }
            
            @org.jetbrains.annotations.NotNull()
            public final com.biopet.domain.mutation.MutationNode.NodeState getNewState() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull()
            public final com.biopet.domain.mutation.MutationTier getTier() {
                return null;
            }
            
            public final int getCost() {
                return 0;
            }
            
            @org.jetbrains.annotations.NotNull()
            public final com.biopet.domain.mutation.MutationNode.NodeState component1() {
                return null;
            }
            
            @org.jetbrains.annotations.NotNull()
            public final com.biopet.domain.mutation.MutationTier component2() {
                return null;
            }
            
            public final int component3() {
                return 0;
            }
            
            @org.jetbrains.annotations.NotNull()
            public final com.biopet.domain.mutation.NeuralGlitchTree.MutationResult.Success copy(@org.jetbrains.annotations.NotNull()
            com.biopet.domain.mutation.MutationNode.NodeState newState, @org.jetbrains.annotations.NotNull()
            com.biopet.domain.mutation.MutationTier tier, int cost) {
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
        }
    }
}