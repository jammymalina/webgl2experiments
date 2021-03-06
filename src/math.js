import { mat4, vec3, quat } from 'gl-matrix';

export const EPS = 0.000001;
export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

export function mod(n, m) {
    return ((n % m) + m) % m;
}

export function clamp(n, min, max) {
    return n <= min ? min : n >= max ? max : n;
}

export function lerpf(start, end, t) {
    return (1 - t) * start + t * end;
}

export class Spherical {
	constructor(radius, phi, theta) {
		this.radius = radius || 1.0;
		this.phi    = phi    || 0;
		this.theta  = theta  || 0;
	}

	clone() {
		return new Spherical(this.radius, this.phi, this.theta);
	}

	copy(otherSpherical) {
		this.radius = otherSpherical.radius;
		this.phi    = otherSpherical.phi;
		this.theta  = otherSpherical.theta;
	}

	set(radius, phi, theta) {
		this.radius = radius;
		this.theta  = theta;
		this.phi    = phi;
	}

	// restrict phi to be between EPS and PI-EPS
	adjustPhi() {
		this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));
	}

	setFromVector(v) {
		this.radius = vec3.length(v);
		if (this.radius === 0) {
			this.theta = 0;
			this.phi   = 0;
		} else {
			this.theta = Math.atan2(v[0], v[2]);
			this.phi   = Math.acos(clamp(v[1] / this.radius, -1, 1));
		}
	}

    toVector() {
        let result = vec3.create();
		this.setVectorFromSpherical(result);
		return result;
    }

    setVectorFromSpherical(out) {
		const sinPhiRadius = Math.sin(this.phi) * this.radius;
		out[0] = sinPhiRadius * Math.sin(this.theta);
		out[1] = Math.cos(this.phi) * this.radius;
		out[2] = sinPhiRadius * Math.cos(this.theta);
    }

	static createFromVector(v) {
		const spherical = new Spherical();
		spherical.fromVector(v);
		return spherical;
	}
}

export function quatFromUnitVectors(vFrom, vTo) {
    let v1 = vec3.create();
    let r = vec3.dot(vFrom, vTo);
    if (r < EPS) {
        r = 0;
        if (Math.abs(vFrom[0]) > math.abs(vFrom[2])) {
            vec3.set(v1, -vFrom[1], vFrom[0], 0);
        } else {
            vec3.set(v1, 0, -vFrom[2], vFrom[1]);
        }
    } else {
        v1.cross(vFrom, vTo);
    }

    let result = quat.fromValues(v1[0], v1[1], v1[2], r);
    quat.normalize(result, result);
    return result;
}

export const Euler = {
    fromRotationMatrix: function(m, order) {
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        let x = 0, y = 0, z = 0;

		const m11 = m[0], m12 = m[4], m13 = m[8];
		const m21 = m[1], m22 = m[5], m23 = m[9];
		const m31 = m[2], m32 = m[6], m33 = m[10];

		order = order || 'XYZ';

		if (order === 'XYZ') {
			y = Math.asin(clamp(m13, -1, 1));

			if (Math.abs(m13) < 0.99999) {
				x = Math.atan2(-m23, m33);
				z = Math.atan2(-m12, m11);
			} else {
				x = Math.atan2(m32, m22);
				z = 0;
			}
		} else if (order === 'YXZ') {
			x = Math.asin(-clamp(m23, -1, 1));

			if (Math.abs(m23) < 0.99999) {
				y = Math.atan2(m13, m33);
				z = Math.atan2(m21, m22);
			} else {
				y = Math.atan2(-m31, m11);
				z = 0;
			}
		} else if (order === 'ZXY') {
			x = Math.asin(clamp(m32, -1, 1));

			if (Math.abs(m32) < 0.99999) {
				y = Math.atan2(-m31, m33);
				z = Math.atan2(-m12, m22);
			} else {
				y = 0;
				z = Math.atan2(m21, m11);
			}
		} else if (order === 'ZYX') {
			y = Math.asin(-clamp(m31, -1, 1));

			if (Math.abs(m31) < 0.99999) {
				x = Math.atan2(m32, m33);
				z = Math.atan2(m21, m11);
			} else {
				x = 0;
				z = Math.atan2(-m12, m22);
			}
		} else if (order === 'YZX') {
			z = Math.asin(clamp(m21, -1, 1));

			if (Math.abs(m21) < 0.99999) {
				x = Math.atan2(-m23, m22);
				y = Math.atan2(-m31, m11);
			} else {
				x = 0;
				y = Math.atan2(m13, m33);
			}
		} else if (order === 'XZY') {
			z = Math.asin(-clamp(m12, -1, 1));

			if (Math.abs(m12) < 0.99999) {
				x = Math.atan2(m32, m22);
				y = Math.atan2(m13, m11);
			} else {
				x = Math.atan2(-m23, m33);
				y = 0;
			}
		} else {
			console.warn(`Euler: fromRotationMatrix() given unsupported order: ${order}`);
		}
        return vec3.fromValues(x, y, z);
    },
    fromQuat: function(q, order) {
        let m = mat4.create();
        mat4.fromQuat(m, q);
        return this.fromRotationMatrix(m, order);
    },
    toQuat(v, order) {
        const c1 = Math.cos(v[0] / 2);
		const c2 = Math.cos(v[1] / 2);
		const c3 = Math.cos(v[2] / 2);
		const s1 = Math.sin(v[0] / 2);
		const s2 = Math.sin(v[1] / 2);
		const s3 = Math.sin(v[2] / 2);

        order = order || 'XYZ';

        let x = 0, y = 0, z = 0, w = 0;
        if (order === 'XYZ') {
			x = s1 * c2 * c3 + c1 * s2 * s3;
			y = c1 * s2 * c3 - s1 * c2 * s3;
			z = c1 * c2 * s3 + s1 * s2 * c3;
			w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if (order === 'YXZ') {
			x = s1 * c2 * c3 + c1 * s2 * s3;
			y = c1 * s2 * c3 - s1 * c2 * s3;
			z = c1 * c2 * s3 - s1 * s2 * c3;
			w = c1 * c2 * c3 + s1 * s2 * s3;
		} else if (order === 'ZXY') {
			x = s1 * c2 * c3 - c1 * s2 * s3;
			y = c1 * s2 * c3 + s1 * c2 * s3;
			z = c1 * c2 * s3 + s1 * s2 * c3;
			w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if (order === 'ZYX') {
			x = s1 * c2 * c3 - c1 * s2 * s3;
			y = c1 * s2 * c3 + s1 * c2 * s3;
			z = c1 * c2 * s3 - s1 * s2 * c3;
			w = c1 * c2 * c3 + s1 * s2 * s3;
		} else if (order === 'YZX') {
			x = s1 * c2 * c3 + c1 * s2 * s3;
			y = c1 * s2 * c3 + s1 * c2 * s3;
			z = c1 * c2 * s3 - s1 * s2 * c3;
			w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if (order === 'XZY') {
			x = s1 * c2 * c3 - c1 * s2 * s3;
			y = c1 * s2 * c3 - s1 * c2 * s3;
			z = c1 * c2 * s3 + s1 * s2 * c3;
			w = c1 * c2 * c3 + s1 * s2 * s3;
		}

        return quat.fromValues(x, y, z, w);
    }
};
