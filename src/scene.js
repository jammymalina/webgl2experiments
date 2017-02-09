import MouseOrbitCamera from './camera/mouseorbit';
import Transform from './transform';
import makeRequest, { makeImageRequest } from './request';
import Shader, { makeShaderRequest } from './shader';
import { GLTexture2d, GLSampler } from './tex2d';
import { hasProps } from './utils';
import BasicMesh, { makeMeshRequest } from './mesh';
import { MouseInput } from './input';

export async function loadScene(gl, sceneURL, progress) {
    const scene = new Scene(gl);
    const config = await makeRequest('GET', sceneURL, {}).then(res => JSON.parse(res.data)).catch((err) => {
        console.error('Augh, there was an error while loading scene!', err.statusText);
        return null;
    });
    let promises = [];

    // shaders
    if (typeof config.shaders !== 'undefined') {
        for (let i = 0; i < config.shaders.length; i++) {
            const shader = config.shaders[i];
            if (hasProps(shader, 'name', 'src')) {
                if (shader.name === 'default') {
                    console.error('Error reading scene config: default shader name is reserved keyword');
                    continue;
                }
                const uniforms = shader.uniforms;
                promises.push(makeShaderRequest(shader.src, {type: 'shader', name: shader.name, uniforms}));
            } else {
                console.error('Error reading scene config: required shader props are name, src');
            }
        }
    }

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
    if (typeof config.meshes !== 'undefined') {
        for (let i = 0; i < config.meshes.length; i++) {
            const mesh = config.meshes[i];
            if (hasProps(mesh, 'name', 'type', 'data')) {
                promises.push(makeMeshRequest(mesh.type, mesh.data, {
                    type: 'mesh',
                    name: mesh.name,
                    mode: typeof mesh.mode === 'undefined' ? 'triangles' : mesh.mode
                }));
            } else {
                console.error('Error reading scene config: required mesh props are name, type, data');
            }
        }
    }

    const results = await Promise.all(promises);

    results.filter(item => item !== null).forEach(item => {
        console.log('Loaded item: ', item);
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
            case 'shader':
                scene.addShader(item.name, item.data, item.uniforms);
                break;
        }
    })

    return scene;
}

export default class Scene {
    constructor(gl) {
        this._gl = gl;
        this.meshes = new Map();
        this.textures = new Map();
        this.materials = new Map();
        this.samplers = new Map();
        this.shaders = new Map();
        this.materials = new Map();
        this.camera = new MouseOrbitCamera(new Transform({}), new Transform({rotation: [Math.PI / 2, 0, Math.PI / 2], position: [0, -2, -2]}), 500, 500);

        this.samplers.set('linear', GLSampler.linearSampler(this.gl));
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
            shader.createProgram(data, uniforms);
            this.shaders.set(name, shader);
        }
    }

    dispose() {
        this.meshes.forEach(m => m.dispose());
        this.textures.forEach(t => t.dispose());
        this.samplers.forEach(s => s.dipose());
        this.shaders.forEach(s => s.dipose());
    }

    render() {
        const gl = this.gl;
        gl.frameClear();
        const mesh = this.meshes.get('ground');
        const sampler = this.samplers.get('linear');
        const texture = this.textures.get('duck');
        const shader = this.shaders.get('lambert');
        const viewMat = this.camera.mat;
        shader.use();

        shader.setUniform_mat4('perspective_matrix', this.camera.projectionMatrix);
        shader.setUniform_mat4('model_view_matrix', this.camera.transform.mat);
        shader.setUniform_mat4('normal_matrix', this.camera.transform.mat);
        shader.setUniform_int('diffuse_texture', 0);
        shader.setUniform_vec3('light_direction_view', [1, 1, 1]);

        texture.bind(0, sampler);
        mesh.draw(shader);

        shader.stop();
    }

    get gl() {
        return this._gl;
    }
}
