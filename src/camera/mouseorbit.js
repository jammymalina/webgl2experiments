import { quat, mat4, vec3 } from 'gl-matrix';

import { MouseInput } from '../input';
import Camera, { PERSPECTIVE_CAMERA } from './camera';
import { clamp, Euler, lerpf } from '../math';
import { Transform } from '../transform';

export default class MouseOrbitCamera extends Camera {
    constructor(target, transform, viewportWidth, viewportHeight) {
        super(viewportWidth, viewportHeight, PERSPECTIVE_CAMERA);
        this.target = target;
        this.transform = transform;

        const eulerAngles = transform.eulerAngles;

        this.rotationYAxis = typeof eulerAngles === undefined ? 0 : eulerAngles[1];
        this.rotationXAxis = typeof eulerAngles === undefined ? 0 : eulerAngles[0];

        this.velocityX = 0;
        this.velocityY = 0;

        this.distance = 5.0;
        this.xSpeed = 120.0;
        this.ySpeed = 120.0;

        this.yMinLimit = -20;
        this.yMaxLimit = 80;

        this.distanceMin = 0.5;
        this.distanceMax = 15;

        this.smoothTime = 2;
        this.smoothWheel = 2;
    }

    update(deltaTime) {
        if (MouseInput.rightButtonDown) {
            this.velocityX += this.xSpeed * MouseInput.dx * 0.02;
            this.velocityY += this.ySpeed * MouseInput.dy * 0.02;
        }

        this.rotationYAxis += this.velocityX;
        this.rotationXAxis -= this.velocityY;

        this.rotationXAxis = clamp(this.rotationXAxis, this.yMinLimit, this.yMaxLimit);

        const eulerAngles = this.transform.eulerAngles;
        const fromRotation = Euler.toQuat(vec3.fromValues(eulerAngles[0], eulerAngles[1], 0));
        const toRotation = Euler.toQuat(vec3.fromValues(this.rotationXAxis, this.rotationYAxis, 0));
        const rotation = toRotation;

        const negDistance = vec3.fromValues(0, 0, -this.distance);
        const position = vec3.create();
        vec3.transformQuat(position, negDistance, rotation);
        vec3.add(position, position, this.target.position);

        this.transform.position = position;
        this.transform.rotation = rotation;

        this.velocityX = lerpf(this.velocityX, 0, deltaTime * this.smoothTime);
        this.velocityY = lerpf(this.velocityY, 0, deltaTime * this.smoothTime);

        this.distance = clamp(this.distance - MouseInput.wheelDelta * this.smoothWheel * deltaTime, this.distanceMin, this.distanceMax);
    }

    get mat() {
        return this.transform.mat;
    }
}
