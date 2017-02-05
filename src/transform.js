import { quat, vec3, mat4 } from 'gl-matrix';
import { Euler } from './math';

export default class Transform {
    constructor({ position, rotation, scale, up, right, forward }) {
        this.position = position || vec3.create();

        this._up      = vec3.create();
        this._right   = vec3.create();
        this._forward = vec3.create();
        this.setDirectionalVectors(up, right, forward);

        this.rotation = typeof rotation === 'undefined' ?
            quat.create() : Euler.toQuat(rotation);

        this.scale = scale || vec3.fromValues(1, 1, 1);
    }

    setDirectionalVectors(up, right, forward) {
        this._up      = up      || vec3.fromValues(0, 1, 0);
        this._right   = right   || vec3.fromValues(1, 0, 0);
        this._forward = forward || vec3.fromValues(0, 0, 1);
        if (typeof up === 'undefined' && typeof right === 'undefined' && typeof forward === 'undefined') {
            return;
        }
        if (typeof forward === 'undefined') {
            vec3.cross(this._forward, this._right, this._up);
            vec3.normalize(this._forward, this._forward);
            return;
        }
        if (typeof right === 'undefined') {
            vec3.cross(this._right, this._up, this._forward);
            vec3.normalize()
        }
        if (typeof up === 'undefined') {
            vec3.cross(this._up, this._forward, this._right);
            vec3.normalize(this._up, this._up);
        }
    }

    get posX() {
        return this.position[0];
    }

    set posX(v) {
        this.position[0] = v;
    }

    get posY() {
        return this.position[1];
    }

    set posY(v) {
        this.position[1] = v;
    }

    get posZ() {
        return this.position[2];
    }

    set posZ(v) {
        this.position[2] = v;
    }

    get scaleX() {
        return this.scale[0];
    }

    set scaleX(v) {
        this.scale[0] = v;
    }

    get scaleY() {
        return this.scale[1];
    }

    set scaleY(v) {
        this.scale[1] = v;
    }

    get scaleZ() {
        return this.scale[2];
    }

    set scaleZ(v) {
        this.scale[2] = v;
    }

    get eulerAngles() {
        return Euler.fromQuat(this.rotation);
    }

    set eulerAngles(v) {
        this.rotation = Euler.toQuat(v);
    }

    get eulerX() {
        const euler = Euler.fromQuat(this.rotation);
        return euler[0];
    }

    set eulerX(v) {
        const euler = Euler.fromQuat(this.rotation);
        this.eulerAngles = vec3.fromValues(v, euler[1], euler[2]);
    }

    get eulerY() {
        const euler = Euler.fromQuat(this.rotation);
        return euler[1];
    }

    set eulerY(v) {
        const euler = Euler.fromQuat(this.rotation);
        this.eulerAngles = vec3.fromValues(euler[0], v, euler[2]);
    }

    get eulerZ() {
        const euler = Euler.fromQuat(this.rotation);
        return euler[2];
    }

    set eulerZ(v) {
        const euler = Euler.fromQuat(this.rotation);
        this.eulerAngles = vec3.fromValues(euler[0], euler[1], v);
    }

    get forward() {
        let result = vec3.create();
        vec3.transformQuat(result, this._forward, this.rotation);
        return result;
    }

    get right() {
        let result = vec3.create();
        vec3.transformQuat(result, this._right, this.rotation);
        return result;
    }

    get up() {
        let result = vec3.create();
        vec3.transformQuat(result, this._up, this.rotation);
        return result;
    }

    get mat() {
        let tMat = mat4.create();
        mat4.fromRotationTranslationScale(tMat, this.rotation, this.position, this.scale);
        return tMat;
    }
}
