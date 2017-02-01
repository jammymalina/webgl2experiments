import { vec3 } from 'gl-matrix';

export default function sphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
	radius = radius || 50;

	widthSegments  = Math.max(3, Math.floor(widthSegments) || 8);
	heightSegments = Math.max(2, Math.floor(heightSegments) || 6);

	phiStart    = typeof phiStart    !== 'undefined' ? phiStart    : 0;
	phiLength   = typeof phiLength   !== 'undefined' ? phiLength   : Math.PI * 2;

	thetaStart  = typeof thetaStart  !== 'undefined' ? thetaStart  : 0;
	thetaLength = typeof thetaLength !== 'undefined' ? thetaLength : Math.PI;

	const thetaEnd = thetaStart + thetaLength;

	let ix, iy;

	let index = 0;
	let grid = [];

	let vertex = vec3.create();
	let normal = vec3.create();

	// buffers
	let indices = [];
	let vertices = [];
	let normals = [];
	let uvs = [];

	// generate vertices, normals and uvs
	for (iy = 0; iy <= heightSegments; iy++) {
		let verticesRow = [];
		const v = iy / heightSegments;
		for (ix = 0; ix <= widthSegments; ix++) {
			const u = ix / widthSegments;

			// vertices
			vertex[0] = -radius * Math.cos(phiStart   + u * phiLength ) * Math.sin(thetaStart + v * thetaLength);
			vertex[1] =  radius * Math.cos(thetaStart + v * thetaLength);
			vertex[2] =  radius * Math.sin(phiStart   + u * phiLength ) * Math.sin(thetaStart + v * thetaLength);

			vertices.push(vertex[0], vertex[1], vertex[2]);

			// normal
			vec3.set(normal, vertex[0], vertex[1], vertex[2]);
			vec3.normalize(normal, normal);
			normals.push(normal[0], normal[1], normal[2]);

			// uv
			uvs.push(u, 1 - v);

			verticesRow.push(index++);
		}
		grid.push(verticesRow);
	}

	// indices
	for (iy = 0; iy < heightSegments; iy++) {
		for (ix = 0; ix < widthSegments; ix++) {
			const a = grid[iy][ix + 1];
			const b = grid[iy][ix];
			const c = grid[iy + 1][ix];
			const d = grid[iy + 1][ix + 1];

			if (iy !== 0 || thetaStart > 0) {
				indices.push(a, b, d);
			}
			if (iy !== heightSegments - 1 || thetaEnd < Math.PI) {
				indices.push(b, c, d);
			}
		}
	}

	return {
		vertices,
		normals,
		uvs,
		indices
	};
}
