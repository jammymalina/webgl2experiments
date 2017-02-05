class Scene {
    constructor() {
        this.meshes = new Map();
    }

    addMesh(name, mesh) {
        if (!this.meshes.has(name)) {
            this.meshes.set(name, mesh);
        }
    }
}
