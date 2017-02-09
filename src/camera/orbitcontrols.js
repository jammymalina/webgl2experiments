import { vec3 } from 'gl-matrix';

class OrbitControls {
    constructor(object, domElement) {
        this.object = object;
        this.domElement = domElement || document;
        this.enabled = true;
        this.target = vec3.create();

        this.minDistance = 0;
        this.maxDistance = Infinity;

        this.minPolarAngle = 0;
        this.maxPolarAngle = Math.PI;

        this.minAzimuthAngle = -Infinity;
        this.maxAzimuthAngle = Infinity;

        // call controls.update() in animation loop
        this.enableDamping = false;
        this.dampingFactor = 0.25;

        this.enableZoom = true;
        this.zoomSpeed  = 1.0;

        this.enableRotate = true;
        this.rotateSpeed  = 1.0;

        // call controls.update() in animation loop
        this.autoRotate = false;
        this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

        this.enableKeys = true;
    }
}
