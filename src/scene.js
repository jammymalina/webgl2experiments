import MouseOrbitCamera from './camera/mouseorbit';
import Transform from './transform';
import makeRequest, { makeImageRequest } from './request';
import Shader from './shader';
import { GLTexture2d } from './tex2d';
import { hasProps } from './utils';
import BasicMesh, { makeMeshRequest } from './mesh';

export default class Scene {
    constructor(gl) {
        this._gl = gl;
        this.meshes = new Map();
        this.textures = new Map();
        this.materials = new Map();
        this.samplers = new Map();
        this.shaders = new Map();
        this.materials = new Map();
        this.camera = new MouseOrbitCamera(new Transform({}), new Transform({}));
    }

    addMesh(name, data) {
        if (!this.meshes.has(name)) {
            const mesh = new BasicMesh(this.gl);
            mesh.create(data);
            this.meshes.set(name, mesh);
        }
    }

    addTexture(name, image) {
        if (!this.textures.has(name)) {
            const texture = new GLTexture2d(this.gl);
            texture.loadImage(image, true);
            this.textures.set(name, texture);
        }
    }

    addMaterial(name, material) {
        if (!this.materials.has(name)) {
            this.materials.set(name, material);
        }
    }

    addShader(name, data, uniforms) {
        if (!this.shaders.has(name)) {
            const shader = new Shader(this.gl);
            this.shaders.set(name, data, uniforms);
        }
    }

    dispose() {
        this.meshes.forEach(m => m.dispose());
        this.textures.forEach(t => t.dispose());
        this.samplers.forEach(s => s.dipose());
        this.shaders.forEach(s => s.dipose());
    }

    render() {

    }

    get gl() {
        return this._gl;
    }
}

export async function loadScene(sceneURL, progress) {
    const scene = new Scene();
    const config = await makeRequest('GET', sceneURL, {}).then(res => JSON.parse(res.data)).catch((err) => {
        console.error('Augh, there was an error while loading scene!', err.statusText);
        return null;
    });
    let promises = [];

    // textures
    if (typeof config.textures !== 'undefined') {
        for (let i = 0; i < config.materials.length; i++) {
            const texture = config.textures[i];
            if (hasProps(texture, 'src', 'name')) {
                promises.push(makeImageRequest(texture.src, {type: 'texture', name: texture.name}));
            } else {
                console.error('Error reading scene config: required texture props are name, src');
            }
        }
    }

    // materials
    if (typeof config.materials !== 'undefined') {
        for (let i = 0; i < config.materials.length; i++) {
            const material = config.materials[i];
            if (hasProps(material, 'name', 'type', 'data')) {
                if (material.name === 'default') {
                    console.error('Error reading scene config: default material name is reserved keyword');
                } else {
                    if (material.shader === 'default') {
                        console.error('Error reading scene config: default shader name is reserved keyword');
                        continue;
                    }
                    promises.push({
                        name: material.name,
                        type: 'material',
                        dataType: material.type,
                        data: material.data,
                        shader: material.shader || 'default'
                    });
                }
            } else {
                console.error('Error reading scene config: required material props are name, type, data');
            }
        }
    }

    // Meshes
    if (typeof congig.meshes !== 'undefined') {
        for (let i = 0; i < config.meshes.length; i++) {
            const mesh = config.meshes[i];
            if (hasProps(mesh, 'name', 'type', 'data')) {
                makeMeshRequest(mesh.type, mesh.data, {
                    type: 'mesh',
                    name: mesh.name,
                    mode: typeof mesh.mode === 'undefined' ? 'triangles' : mesh.mode
                });
            } else {
                console.error('Error reading scene config: required mesh props are name, type, data');
            }
        }
    }

    const results = await Promise.all(promises);

    results.filter(item => item !== null).forEach(item => {
        switch (item.type) {
            case 'material':
                scene.addMaterial(item.name, {
                    shader: item.shader,
                    type: item.dataType,
                    data: item.data
                });
                break;
            case 'texture':
                scene.addTexture(item.name, item.data);
                break;
            case 'mesh':
                scene.addMesh(item.name, {
                    mode: item.mode,
                    ...item.data
                });
                break;
        }
    })

    return scene;
}
