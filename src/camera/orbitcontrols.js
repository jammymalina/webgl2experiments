import { vec3, vec2, quat } from 'gl-matrix';
import { ArrowKey, MouseButton } from '../input';
import { Spherical, quatFromUnitVectors, EPS } from '../math';

const STATE = {
    NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2,
    TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5
};

export class OrbitControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement || document;
        this.enabled = true;
        this.target = vec3.create();

        this.spherical      = new Spherical();
        this.sphericalDelta = new Spherical();
        this.scale          = 1;

        this.panOffset = vec3.create();
        this.panStart  = vec2.create();
	    this.panEnd    = vec2.create();
	    this.panDelta  = vec2.create();

        this.dollyStart = vec2.create();
	    this.dollyEnd   = vec2.create();
        this.dollyDelta = vec2.create();

        this.minDistance = 0;
        this.maxDistance = Infinity;

        this.minPolarAngle = 0;
        this.maxPolarAngle = Math.PI;

        this.minAzimuthAngle = -Infinity;
        this.maxAzimuthAngle = Infinity;

        // call controls.update() in animation loop
        this.enableDamping = false;
        this.dampingFactor = 0.25;

        this.enableZoom  = true;
        this.zoomSpeed   = 1.0;
        this.zoomChanged = false;

        this.enableRotate = true;
        this.rotateSpeed  = 1.0;

        this.enablePan   = true;
        this.keyPanSpeed = 7.0;

        // call controls.update() in animation loop
        this.autoRotate      = false;
        this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

        this.enableKeys = true;

        this.state = STATE.NONE;

        this.target0 = vec3.clone(this.target);
        this.position0 = vec3.clone(this.camera.transform.position);
        this.zoom0 = this.camera.zoom;

        this.offset = vec3.create();
        this.q = quatFromUnitVectors(this.camera.transform.up, vec3.fromValues(0, 1, 0));
        this.qInverse = quat.create();
        quat.invert(this.qInverse, this.q);

        this.lastPosition = vec3.create();
        this.lastQuaternion = quat.create();

        this.position = this.camera.transform.position;
    }

    reset() {
        vec3.copy(this.target, this.target0);
        vec3.copy(this.camera.position, this.position0);
        this.camera.zoom = this.zoom0;

        this.camera.updateMatrix();
        this.update();

        this.state = STATE.NONE;
    }

    update(timeDelta) {

        vec3.copy(this.offset, this.position);
        vec3.sub(this.offset, this.offset, this.target);
        vec3.transformQuat(this.offset, this.offset, this.q);

        this.spherical.setFromVector(this.offset);

        if (this.autoRotate && this.state === STATE.NONE) {
            this.rotateLeft(this.getAutoRotationAngle(timeDelta));
        }

        this.spherical.theta += this.sphericalDelta.theta;
        this.spherical.phi   += this.sphericalDelta.phi;

        // restrict theta to be between desired limits
		this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta));
		// restrict phi to be between desired limits
		this.spherical.phi = Math.max(scope.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));
        this.spherical.adjustPhi();

        this.spherical.radius *= scale;

        this.spherical.radius = clamp(this.spherical.radius, this.minDistance, this.maxDistance);
        vec3.add(this.target, this.target, this.panOffset);

        this.spherical.setVectorFromSpherical(this.offset);
        vec3.transformQuat(this.offset, this.offset, this.qInverse);

        vec3.copy(this.position, this.target);
        vec3.add(this.position, this.position, this.offset);

        this.camera.lookAt(this.target);

        if (this.enableDamping) {
            this.sphericalDelta.theta *= (1 - this.dampingFactor);
            this.sphericalDelta.phi   *= (1 - this.dampingFactor);
        } else {
            this.sphericalDelta.set(0, 0, 0);
        }

        this.scale = 1;
        vec3.set(this.panOffset, 0, 0, 0);

        if (this.zoomChanged ||
            vec3.squaredDistance(this.lastPosition, this.camera.transform.position) > EPS ||
            8 * (1 - quat.dot(this.lastQuaternion, this.camera.transform.rotation)) > EPS
        ) {
            vec3.copy(this.lastPosition, this.camera.position);
            quat.copy(this.lastQuaternion, this.camera.transform.rotation);
            this.zoomChanged = false;
            return true;
        }

        return false;
    }

    get polarAngle() {
        return this.spherical.phi;
    }

    get azimuthalAngle() {
        return this.spherical.theta;
    }

    get zoomScale() {
		return Math.pow(0.95, this.zoomSpeed);
    }

    getAutoRotationAngle(timeDelta) {
		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
	}
}
