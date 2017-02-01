import { vec3 } from 'gl-matrix';

export default function sphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
	radius = radius || 50;

	widthSegments  = Math.max(3, Math.floor(widthSegments) || 8);
	heightSegments = Math.max(2, Math.floor(heightSegments) || 6);

	phiStart    = typeof phiStart !== 'undefined'    ? phiStart : 0;
	phiLength   = typeof phiLength !== 'undefined'   ? phiLength : Math.PI * 2;

	thetaStart  = typeof thetaStart !== 'undefined'  ? thetaStart : 0;
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
		var verticesRow = [];
		var v = iy / heightSegments;
		for ( ix = 0; ix <= widthSegments; ix ++ ) {

			var u = ix / widthSegments;

			// vertex

			vertex.x = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
			vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
			vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

			vertices.push( vertex.x, vertex.y, vertex.z );

			// normal

			normal.set( vertex.x, vertex.y, vertex.z ).normalize();
			normals.push( normal.x, normal.y, normal.z );

			// uv

			uvs.push( u, 1 - v );

			verticesRow.push( index ++ );

		}

		grid.push( verticesRow );

	}

	// indices

	for ( iy = 0; iy < heightSegments; iy ++ ) {

		for ( ix = 0; ix < widthSegments; ix ++ ) {

			var a = grid[ iy ][ ix + 1 ];
			var b = grid[ iy ][ ix ];
			var c = grid[ iy + 1 ][ ix ];
			var d = grid[ iy + 1 ][ ix + 1 ];

			if ( iy !== 0 || thetaStart > 0 ) indices.push( a, b, d );
			if ( iy !== heightSegments - 1 || thetaEnd < Math.PI ) indices.push( b, c, d );

		}

	}

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

}
