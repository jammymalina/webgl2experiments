#version 300 es

precision highp float;
precision highp int;

layout (location = 0) in position;
layout (location = 1) in tex_coord;

uniform vec2 texture_size;
uniform mat4 transformation_matrix;

out vec4 tex0;
out vec4 tex1;

void main() {
    vec2 ps = vec2(1.0 / texture_size.x, 1.0 / texture_size.y);
    
    tex0 = tex_coord;
    tex1.xy = vec2(ps.x, 0); // F
    tex1.zw = vec2(0, ps.y); // H

    gl_Position = transformation_matrix * position;
}
