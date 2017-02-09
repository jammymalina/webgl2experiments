#version 300 es

precision highp float;
precision highp int;

uniform sampler2D diffuse_texture;
uniform vec3 light_direction_view;

smooth in vec3 frag_normal;
smooth in vec2 frag_uvs;

layout (location = 0) out vec4 frag_color;

void main() {
    vec3 n = normalize(frag_normal);
    vec3 l = normalize(light_direction_view);
    float cosine = dot(n, l);
    float product = max(cosine, 0.0);
    vec4 tex_color = texture(diffuse_texture, frag_uvs);
    frag_color = tex_color;
    // frag_color = vec4(1, 0, 0, 1);
}
