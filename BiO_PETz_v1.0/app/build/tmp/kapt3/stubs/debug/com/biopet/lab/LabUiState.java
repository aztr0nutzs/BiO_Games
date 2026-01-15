package com.biopet.lab;

@kotlin.Metadata(mv = {2, 3, 0}, k = 1, xi = 48, d1 = {"\u00000\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\b\n\u0002\b\u0003\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u001d\n\u0002\u0010\u000e\n\u0000\b\u0086\b\u0018\u00002\u00020\u0001B[\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0003\u0012\u0006\u0010\u0005\u001a\u00020\u0003\u0012\f\u0010\u0006\u001a\b\u0012\u0004\u0012\u00020\b0\u0007\u0012\f\u0010\t\u001a\b\u0012\u0004\u0012\u00020\n0\u0007\u0012\u0006\u0010\u000b\u001a\u00020\f\u0012\u0006\u0010\r\u001a\u00020\f\u0012\u0006\u0010\u000e\u001a\u00020\f\u0012\u0006\u0010\u000f\u001a\u00020\u0003\u00a2\u0006\u0004\b\u0010\u0010\u0011J\t\u0010\u001c\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u001d\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u001e\u001a\u00020\u0003H\u00c6\u0003J\u000f\u0010\u001f\u001a\b\u0012\u0004\u0012\u00020\b0\u0007H\u00c6\u0003J\u000f\u0010 \u001a\b\u0012\u0004\u0012\u00020\n0\u0007H\u00c6\u0003J\t\u0010!\u001a\u00020\fH\u00c6\u0003J\t\u0010\"\u001a\u00020\fH\u00c6\u0003J\t\u0010#\u001a\u00020\fH\u00c6\u0003J\t\u0010$\u001a\u00020\u0003H\u00c6\u0003Jo\u0010%\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u00032\b\b\u0002\u0010\u0005\u001a\u00020\u00032\u000e\b\u0002\u0010\u0006\u001a\b\u0012\u0004\u0012\u00020\b0\u00072\u000e\b\u0002\u0010\t\u001a\b\u0012\u0004\u0012\u00020\n0\u00072\b\b\u0002\u0010\u000b\u001a\u00020\f2\b\b\u0002\u0010\r\u001a\u00020\f2\b\b\u0002\u0010\u000e\u001a\u00020\f2\b\b\u0002\u0010\u000f\u001a\u00020\u0003H\u00c6\u0001J\u0014\u0010&\u001a\u00020\f2\b\u0010\'\u001a\u0004\u0018\u00010\u0001H\u00d6\u0083\u0004J\n\u0010(\u001a\u00020\u0003H\u00d6\u0081\u0004J\n\u0010)\u001a\u00020*H\u00d6\u0081\u0004R\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\u0013R\u0011\u0010\u0004\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0014\u0010\u0013R\u0011\u0010\u0005\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0015\u0010\u0013R\u0017\u0010\u0006\u001a\b\u0012\u0004\u0012\u00020\b0\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0016\u0010\u0017R\u0017\u0010\t\u001a\b\u0012\u0004\u0012\u00020\n0\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0018\u0010\u0017R\u0011\u0010\u000b\u001a\u00020\f\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000b\u0010\u0019R\u0011\u0010\r\u001a\u00020\f\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001a\u0010\u0019R\u0011\u0010\u000e\u001a\u00020\f\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\u0019R\u0011\u0010\u000f\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001b\u0010\u0013\u00a8\u0006+"}, d2 = {"Lcom/biopet/lab/LabUiState;", "", "petSpriteRes", "", "instability", "corruption", "nodes", "", "Lcom/biopet/lab/MutationNode;", "connections", "Lcom/biopet/lab/MutationConnection;", "isRollbackAvailable", "", "showGlitchOverlay", "isApplyingMutation", "availableNeuralPoints", "<init>", "(IIILjava/util/List;Ljava/util/List;ZZZI)V", "getPetSpriteRes", "()I", "getInstability", "getCorruption", "getNodes", "()Ljava/util/List;", "getConnections", "()Z", "getShowGlitchOverlay", "getAvailableNeuralPoints", "component1", "component2", "component3", "component4", "component5", "component6", "component7", "component8", "component9", "copy", "equals", "other", "hashCode", "toString", "", "app_debug"})
public final class LabUiState {
    private final int petSpriteRes = 0;
    private final int instability = 0;
    private final int corruption = 0;
    @org.jetbrains.annotations.NotNull()
    private final java.util.List<com.biopet.lab.MutationNode> nodes = null;
    @org.jetbrains.annotations.NotNull()
    private final java.util.List<com.biopet.lab.MutationConnection> connections = null;
    private final boolean isRollbackAvailable = false;
    private final boolean showGlitchOverlay = false;
    private final boolean isApplyingMutation = false;
    private final int availableNeuralPoints = 0;
    
    public LabUiState(int petSpriteRes, int instability, int corruption, @org.jetbrains.annotations.NotNull()
    java.util.List<com.biopet.lab.MutationNode> nodes, @org.jetbrains.annotations.NotNull()
    java.util.List<com.biopet.lab.MutationConnection> connections, boolean isRollbackAvailable, boolean showGlitchOverlay, boolean isApplyingMutation, int availableNeuralPoints) {
        super();
    }
    
    public final int getPetSpriteRes() {
        return 0;
    }
    
    public final int getInstability() {
        return 0;
    }
    
    public final int getCorruption() {
        return 0;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.biopet.lab.MutationNode> getNodes() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.biopet.lab.MutationConnection> getConnections() {
        return null;
    }
    
    public final boolean isRollbackAvailable() {
        return false;
    }
    
    public final boolean getShowGlitchOverlay() {
        return false;
    }
    
    public final boolean isApplyingMutation() {
        return false;
    }
    
    public final int getAvailableNeuralPoints() {
        return 0;
    }
    
    public final int component1() {
        return 0;
    }
    
    public final int component2() {
        return 0;
    }
    
    public final int component3() {
        return 0;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.biopet.lab.MutationNode> component4() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.biopet.lab.MutationConnection> component5() {
        return null;
    }
    
    public final boolean component6() {
        return false;
    }
    
    public final boolean component7() {
        return false;
    }
    
    public final boolean component8() {
        return false;
    }
    
    public final int component9() {
        return 0;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.biopet.lab.LabUiState copy(int petSpriteRes, int instability, int corruption, @org.jetbrains.annotations.NotNull()
    java.util.List<com.biopet.lab.MutationNode> nodes, @org.jetbrains.annotations.NotNull()
    java.util.List<com.biopet.lab.MutationConnection> connections, boolean isRollbackAvailable, boolean showGlitchOverlay, boolean isApplyingMutation, int availableNeuralPoints) {
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