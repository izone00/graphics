#version 300 es
#ifdef GL_ES
precision mediump float;
#endif
in vec4 vColor;
uniform vec4 uColor;
out vec4 fColor;
void main()
{
    if(length(gl_PointCoord.xy-vec2(0.5)) > 0.5)   discard; 
    fColor = vColor;
    if (vColor.r * 16.0 < 0.5)
        fColor.r *= 16.0 * 2.0;
    
}


