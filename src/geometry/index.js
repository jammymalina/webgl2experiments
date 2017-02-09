import planeGeometry from './plane';
import sphereGeometry from './sphere';

export default function generateGeometry(type, params) {
    params = params || {};
    switch (type) {
        case 'plane':
            return planeGeometry(params);
        case 'sphere':
            return sphereGeometry(params);
    }
    console.error('Invalid geometry type: ', type);
    return null;
}
