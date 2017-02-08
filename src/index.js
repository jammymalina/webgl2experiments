import GLInstance from './gl';
import BasicMesh from './mesh';
import MouseOrbitCamera from './camera/mouseorbit';
import planeBufferGeometry from './geometry/plane';
import Shader from './shader';
import Transform from './transform';
import { loadScene } from './scene';

let gl;

window.addEventListener('load', function() {
    gl = new GLInstance('glcanvas').frameSetSize(500, 500).frameClear();

    loadScene(gl, './src/scenes/basic.json').then(scene => {
        console.log('Loading scene finished');
        scene.render();
    });

    window.addEventListener('resize', function() {
        gl.frameSetSize(window.innerWidth, window.innerHeight);
    });
});
