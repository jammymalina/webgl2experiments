import GLInstance from './gl';
import BasicMesh from './mesh';
import MouseOrbitCamera from './camera/mouseorbit';
import planeBufferGeometry from './geometry/plane';
import Shader from './shader';
import Transform from './transform';

let gl;

window.addEventListener('load', function() {
    gl = new GLInstance('glcanvas').frameSetSize(500, 500).frameClear();

    const lambert = new Shader(gl);
    lambert.compileShaders([{
        type: gl.VERTEX_SHADER,
        src: document.getElementById('lambert-vs').textContent
    }, {
        type: gl.FRAGMENT_SHADER,
        src: document.getElementById('lambert-fs').textContent
    }], ['model_view_matrix', 'normal_matrix', 'diffuse_texture', 'light_direction_view']);
    const plane = planeBufferGeometry(gl);
    const mesh = new BasicMesh(gl);
    mesh.create({
        vertices: {
            data: plane.vertices,
            dimension: 3,
            totalByteSize: 12
        },
        normals: {
            data: plane.normals,
            dimension: 3,
            totalByteSize: 12
        },
        uvs: {
            data: plane.uvs,
            dimension: 2,
            totalByteSize: 8
        },
        mode: gl.TRIANGLES
    });
    const camera = new MouseOrbitCamera(new Transform(), new Transform());

    window.addEventListener('resize', function() {
        gl.frameSetSize(window.innerWidth, window.innerHeight);
    });
});
