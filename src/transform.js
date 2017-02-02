import { quat, vec3, mat4 } from 'gl-matrix';
import { Euler } from './math';

export default class Transform {
    constructor({ position, rotation, scale }) {
        this.position = position || vec3.create();
        this.rotation = typeof rotation === 'undefined' ?
            quat.create() : Euler.toQuat(rotation);
        this.scale = scale || vec3.fromValues(1, 1, 1);
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

    get mat() {
        let tMat = mat4.create();
        mat4.fromRotationTranslationScale(tMat, this.rotation, this.position, this.scale);
        return tMat;
    }
}
