import GLInstance from './gl';
import BasicMesh from './mesh';
import MouseOrbitCamera from './camera/mouseorbit';
import planeBufferGeometry from './geometry/plane';
import Shader from './shader';

let gl;

window.addEventListener('load', function() {
    gl = new GLInstance('glcanvas').frameSetSize(500, 500).frameClear();

    const shader = new Shader(gl);

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
    mesh.dispose();

    window.addEventListener('resize', function() {
        gl.frameSetSize(window.innerWidth, window.innerHeight);
    });
});
