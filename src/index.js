import GLInstance from './gl';
import BasicMesh from './mesh';
import MouseOrbitCamera from './camera/mouseorbit';
import planeBufferGeometry from './geometry/plane';
import Shader from './shader';
import Transform from './transform';
import { loadScene } from './scene';
import RenderLoop from './renderloop';
import { MouseInput } from './input';

let gl;

window.addEventListener('load', function() {
    gl = new GLInstance('glcanvas').frameSetSize(500, 500).frameClear();

    loadScene(gl, './src/scenes/basic.json').then(scene => {
        scene.camera.setViewport(500, 500);
        const loop = new RenderLoop(deltaTime => {
            scene.render();
            scene.camera.update(deltaTime);
            MouseInput.resetWheelDelta();
            //console.log(deltaTime);
        });
        loop.start();
        console.log('Loading scene finished');
        console.log(scene);
    });

    window.addEventListener('resize', function() {
        //gl.frameSetSize(window.innerWidth, window.innerHeight);
    });
});
