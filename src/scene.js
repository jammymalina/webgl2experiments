import MouseOrbitCamera from './camera/mouseorbit';
import Transform from './transform';
import makeRequest, { makeImageRequest } from './request.js';

export default class Scene {
    constructor() {
        this.meshes = new Map();
        this.textures = new Map();
        this.samplers = new Map();
        this.camera = new MouseOrbitCamera(new Transform({}), new Transform({}));
    }

    addMesh(name, mesh) {
        if (!this.meshes.has(name)) {
            this.meshes.set(name, mesh);
        }
    }

    addTextures(name, texture) {
        if (!this.textures.has(name)) {
            this.textures.set(name, texture);
        }
    }

    dispose() {
        this.meshes.forEach(m => m.dispose());
        this.texutres.forEach(t => t.dispose());
        this.samplers.forEach(s => s.dipose());
    }
}

export async function loadScene(sceneURL, progress) {
    const scene = new Scene();
    const config = await makeRequest('GET', sceneURL).then(res => JSON.parse(res)).catch((err) => {
        console.error('Augh, there was an error while loading scene!', err.statusText);
        return null;
    });
    let promises = [];

    // Materials
    if (typeof config.materials !== 'undefined') {
        for (let i = 0; i < config.materials.length; i++) {
            const material = config.materials[i];
            if (material.type === 'texture' && typeof material.src !== 'undefined') {
                promises.push(makeImageRequest(material.src));
            }
        }
    }

    // Meshes
    if (typeof congig.meshes !== 'undefined') {
        for (let i = 0; i < results.length; i++) {
            
        }
    }

    const results = await Promise.all(promises);

    return scene;
}
