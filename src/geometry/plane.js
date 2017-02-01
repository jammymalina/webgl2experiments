export default function planeBufferGeometry( width, height, widthSegments, heightSegments ) {
	const widthHalf  = width  / 2;
	const heightHalf = height / 2;

	const gridX = Math.floor( widthSegments ) || 1;
	const gridY = Math.floor( heightSegments ) || 1;

	const gridX1 = gridX + 1;
	const gridY1 = gridY + 1;

	const segmentWidth  = width  / gridX;
	const segmentHeight = height / gridY;

	let ix, iy;

	// buffers
	let indices = [];
	let vertices = [];
	let normals = [];
	let uvs = [];

	// generate vertices, normals and uvs
	for (iy = 0; iy < gridY1; iy++) {
		const y = iy * segmentHeight - heightHalf;

		for (ix = 0; ix < gridX1; ix++) {
			const x = ix * segmentWidth - widthHalf;

			vertices.push(x, -y, 0);
			normals.push(0, 0, 1);
			uvs.push(ix / gridX);
			uvs.push(1 - (iy / gridY));
		}
	}

	// indices
	for (iy = 0; iy < gridY; iy++) {
		for (ix = 0; ix < gridX; ix++) {
			const a = ix + gridX1 * iy;
			const b = ix + gridX1 * (iy + 1);
			const c = (ix + 1) + gridX1 * (iy + 1);
			const d = (ix + 1) + gridX1 * iy;

			// faces
			indices.push(a, b, d);
			indices.push(b, c, d);
		}
	}

	return {
		vertices,
		normals,
		uvs,
		indices
	};
}
