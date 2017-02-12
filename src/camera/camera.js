import { mat4 } from 'gl-matrix';
import Transform from '../transform';
import { DEG_TO_RAD, RAD_TO_DEG } from '../math';

export const ORTHO_CAMERA       = 'ortho';
export const PERSPECTIVE_CAMERA = 'perspective';

export default class Camera {
    constructor(transform, viewportWidth, viewportHeight, type) {
        this.transform = transform || new Transform({});
        this._type = type || ORTHO_CAMERA;
        this._projectionMatrix = mat4.create();
        this.setViewport(viewportWidth, viewportHeight);
    }

    setViewport(viewportWidth, viewportHeight) {
        this._viewportWidth  = viewportWidth  || 1;
        this._viewportHeight = viewportHeight || 1;
    }

    lookAt(target) {
        let out = mat4.create();
        mat4.lookAt(out, this.transform.position, target, this.transform.up);
        mat4.getRotation(this.transform.rotation, out);
    }

    get type() {
        return this._type;
    }

    set type(val) {
        this._type = val;
        this.setViewport(this.viewportWidth, this.viewportHeight);
    }

    get viewportWidth() {
        return this._viewportWidth;
    }

    get viewportHeight() {
        return this._viewportHeight;
    }

    get projectionMatrix() {
        return this._projectionMatrix;
    }
}

export class PerspectiveCamera extends Camera {
    constructor({ viewportWidth, viewportHeight, fov, near, far }) {
        super(viewportWidth, viewportHeight, PERSPECTIVE_CAMERA);
        this._fov  = fov  || 85;
        this._near = near || 0.1;
        this._far  = far  || 1000.0;
        this.zoom = 1;
        this.updateMatrix();
    }

    setViewport(viewportWidth, viewportHeight) {
        super.setViewport(viewportWidth, viewportHeight);
        this.updateMatrix();
    }

    updateMatrix() {
        const far    = this.far;
        const near   = this.near;
        const top    = near * Math.tan(DEG_TO_RAD * 0.5 * this.fov) / this.zoom;
        const height = 2 * top;
        const width  = this.aspect * height;
        const left   = -0.5 * width;
        const right  = left + width;
        const bottom  = top - height;

        const x = 2 * near / (right - left);
		const y = 2 * near / (top - bottom);

		const a =  (right + left) / (right - left);
		const b =  (top + bottom) / (top - bottom);
		const c = -(far + near)   / (far - near);
		const d = -2 * far * near / (far - near);

        mat4.set(this._projectionMatrix,
            x,  0,  0,  0,
            0,  y,  0,  0,
            a,  b,  c, -1,
            0,  0,  d,  0
       );
    }

    get fov() {
        return this._fov;
    }

    get near() {
        return this._near;
    }

    get far() {
        return this._far;
    }

    get aspect() {
        return this.viewportWidth / this.viewportHeight
    }

    get effectiveFOV() {
        return RAD_TO_DEG * 2 * Math.atan(Math.tan(DEG_TO_RAD * 0.5 * this.fov) / this.zoom);
    }
}
