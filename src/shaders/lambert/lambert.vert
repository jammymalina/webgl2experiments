#version 300 es

precision highp float;
precision highp int;

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 uvs;

uniform mat4 model_view_matrix;
uniform mat4 normal_matrix;
uniform mat4 perspective_matrix;

smooth out vec3 frag_normal;
smooth out vec2 frag_uvs;

void main() {
    frag_normal = normal_matrix;
    frag_uvs = uvs;
    gl_Position = perspective_matrix * model_view_matrix * vec4(position, 1.0);
}
