#version 300 es

precision highp float;
precision highp int;

smooth in vec4 tex0;
smooth in vec4 tex1;

const float coef = 2.0;
const vec3 yuv_weighted = vec3(14.352, 28.176, 5.472);

uniform vec2 texture_size;
uniform sampler2D decal;

vec4 df(vec4 A, vec4 B) {
    vec4 result = vec4(A.x - B.x, A.y - B.y, A.z - B.z, A.w - B.w);
    return abs(result);
}

vec4 weighted_distance(vec4 a, vec4 b, vec4 c, vec4 d, vec4 e, vec4 f, vec4 g, vec4 h) {
    return (df(a, b) + df(a, c) + df(d, e) + df(d, f) + 4.0 * df(g, h));
}

layout (location = 0) out vec4 frag_color;

void main() {
    bvec4 edr, edr_left, edr_up, px; // px = pixel, edr = edge detection rule
    bvec4 ir_lv1, ir_lv2_left, ir_lv2_up;
    bvec4 nc; // new_color
    bvec4 fx, fx_left, fx_up; // inequations of straight lines.

    vec2 fp = fract(tex0 * texture_size);
    vec2 dx = tex1.xy;
    vec2 dy = tex1.zw;

    vec3 A  = texture(decal, tex0 - dx - dy).xyz;
    vec3 B  = texture(decal, tex0 - dy).xyz;
    vec3 C  = texture(decal, tex0 + dx - dy).xyz;
    vec3 D  = texture(decal, tex0 - dx).xyz;
    vec3 E  = texture(decal, tex0).xyz;
    vec3 F  = texture(decal, tex0 + dx).xyz;
    vec3 G  = texture(decal, tex0 - dx + dy).xyz;
    vec3 H  = texture(decal, tex0 + dy).xyz;
    vec3 I  = texture(decal, tex0 + dx + dy).xyz;
    vec3 A1 = texture(decal, tex0 - dx - 2.0 * dy).xyz;
    vec3 C1 = texture(decal, tex0 + dx - 2.0 * dy).xyz;
    vec3 A0 = texture(decal, tex0 - 2.0 * dx - dy).xyz;
    vec3 G0 = texture(decal, tex0 - 2.0 * dx + dy).xyz;
    vec3 C4 = texture(decal, tex0 + 2.0 * dx - dy).xyz;
    vec3 I4 = texture(decal, tex0 + 2.0 * dx + dy).xyz;
    vec3 G5 = texture(decal, tex0 - dx + 2.0 * dy).xyz;
    vec3 I5 = texture(decal, tex0 + dx + 2.0 * dy).xyz;
    vec3 B1 = texture(decal, tex0 - 2.0 * dy).xyz;
    vec3 D0 = texture(decal, tex0 - 2.0 * dx).xyz;
    vec3 H5 = texture(decal, tex0 + 2.0 * dy).xyz;
    vec3 F4 = texture(decal, tex0 + 2.0 * dx).xyz;

    vec4 b = yuv_weighted * mat4x3(B, D, H, F);
    vec4 c = yuv_weighted * mat4x3(C, A, G, I);
    vec4 e = yuv_weighted * mat4x3(E, E, E, E);
    vec4 d = b.yzwx;
    vec4 f = b.wxyz;
    vec4 g = c.zwxy;
    vec4 h = b.zwxy;
    vec4 i = c.wxyz;

    vec4 i4 = yuv_weighted * mat4x3(I4, C1, A0, G5);
    vec4 i5 = yuv_weighted * mat4x3(I5, C4, A1, G0);
    vec4 h5 = yuv_weighted * mat4x3(H5, F4, B1, D0);
    vec4 f4 = h5.yzwx;

    vec4 Ao = vec4(1.0, -1.0, -1.0, 1.0);
    vec4 Bo = vec4(1.0, 1.0, -1.0, -1.0);
    vec4 Co = vec4(1.5, 0.5, -0.5, 0.5);
    vec4 Ax = vec4(1.0, -1.0, -1.0, 1.0);
    vec4 Bx = vec4(0.5, 2.0, -0.5, -2.0);
    vec4 Cx = vec4(1.0, 1.0, -0.5, 0.0);
    vec4 Ay = vec4(1.0, -1.0, -1.0, 1.0);
    vec4 By = vec4(2.0, 0.5, -2.0, -0.5);
    vec4 Cy = vec4(2.0, 0.0, -1.0, 0.5);

    // These inequations define the line below which interpolation occurs.
    fx.x = (Ao.x * fp.y + Bo.x * fp.x > Co.x);
    fx_left.x = (Ax.x * fp.y + Bx.x * fp.x > Cx.x);
    fx_up.x = (Ay.x * fp.y + By.x * fp.x > Cy.x);

    fx.y = (Ao.y * fp.y + Bo.y * fp.x > Co.y);
    fx_left.y = (Ax.y * fp.y + Bx.y * fp.x > Cx.y);
    fx_up.y = (Ay.y * fp.y + By.y * fp.x > Cy.y);

    fx.z = (Ao.z * fp.y + Bo.z * fp.x > Co.z);
    fx_left.z = (Ax.z * fp.y + Bx.z * fp.x > Cx.z);
    fx_up.z = (Ay.z * fp.y + By.z * fp.x > Cy.z);

    fx.w = (Ao.w * fp.y + Bo.w * fp.x > Co.w);
    fx_left.w = (Ax.w * fp.y + Bx.w * fp.x > Cx.w);
    fx_up.w = (Ay.w * fp.y + By.w * fp.x > Cy.w);

    //ir_lv1.x = ((e.x != f.x) && (e.x != h.x));
    //ir_lv1.y = ((e.y != f.y) && (e.y != h.y));
    //ir_lv1.z = ((e.z != f.z) && (e.z != h.z));
    //ir_lv1.w = ((e.w != f.w) && (e.w != h.w));
    ir_lv1 = ((e != f) && (e != h));

    //ir_lv2_left.x = ((e.x != g.x) && (d.x != g.x));
    //ir_lv2_left.y = ((e.y != g.y) && (d.y != g.y));
    //ir_lv2_left.z = ((e.z != g.z) && (d.z != g.z));
    //ir_lv2_left.w = ((e.w != g.w) && (d.w != g.w));
    ir_lv2_left = ((e != g) && (d != g));

    //ir_lv2_up.x = ((e.x != c.x) && (b.x != c.x));
    //ir_lv2_up.y = ((e.y != c.y) && (b.y != c.y));
    //ir_lv2_up.z = ((e.z != c.z) && (b.z != c.z));
    //ir_lv2_up.w = ((e.w != c.w) && (b.w != c.w));
    ir_lv2_up = ((e != c) && (b != c));

    vec4 w1 = weighted_distance(e, c, g, i, h5, f4, h, f);
    vec4 w2 = weighted_distance(h, d, i5, f, i4, b, e, i);

    // begin optimization: reduction of 6 instruction slots
    vec4 df_fg = df(f, g);
    vec4 df_hc = df(h, c);
    // end optimization

    vec4 t1 = (coef * df_fg);
    vec4 t2 = df_hc;
    vec4 t3 = df_fg;
    vec4 t4 = (coef * df_hc);

    //edr = bool4((w1.x < w2.x) && ir_lv1.x,
    //            (w1.y < w2.y) && ir_lv1.y,
    //            (w1.z < w2.z) && ir_lv1.z,
    //            (w1.w < w2.w) && ir_lv1.w);
    edr = (w1 < w2) && ir_lv1;

    //edr_left = bool4((t1.x <= t2.x) && ir_lv2_left.x,
    //                 (t1.y <= t2.y) && ir_lv2_left.y,
    //                 (t1.z <= t2.z) && ir_lv2_left.z,
    //                 (t1.w <= t2.w) && ir_lv2_left.w);
    edr_left = (t1 <= t2) && ir_lv2_left;

    //edr_up = bool4((t4.x <= t3.x) && ir_lv2_up.x,
    //               (t4.y <= t3.y) && ir_lv2_up.y,
    //               (t4.z <= t3.z) && ir_lv2_up.z,
    //               (t4.w <= t3.w) && ir_lv2_up.w);
    edr_up = (t4 <= t3) && ir_lv2_up;

    //nc.x = (edr.x && (fx.x || edr_left.x && fx_left.x || edr_up.x && fx_up.x));
    //nc.y = (edr.y && (fx.y || edr_left.y && fx_left.y || edr_up.y && fx_up.y));
    //nc.z = (edr.z && (fx.z || edr_left.z && fx_left.z || edr_up.z && fx_up.z));
    //nc.w = (edr.w && (fx.w || edr_left.w && fx_left.w || edr_up.w && fx_up.w));
    nc = (edr && (fx || edr_left && fx_left || edr_up && fx_up));

    // to actually compile this shader, uncomment the following line
    // which reduces the instruction count to under 512
    //nc.zw = (vec2)0;

    t1 = df(e, f);
    t2 = df(e, h);

    //px = bool4(t1.x <= t2.x,
    //           t1.y <= t2.y,
    //           t1.z <= t2.z,
    //           t1.w <= t2.w);
    px = t1 <= t2;

    vec3 res = nc.x ? px.x ? F : H : nc.y ? px.y ? B : F : nc.z ? px.z ? D : B : nc.w ? px.w ? H : D : E;

    frag_color = vec4(res.x, res.y, res.z, 1.0);
}
