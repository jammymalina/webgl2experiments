export function hasProps(obj, ...props) {
    for (let i = 0; i < props.length; i++) {
        if (!obj.hasOwnProperty(props[i])) {
            return false;
        }
    }
    return true;
}
