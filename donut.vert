#version 300 es
#define M_PI 3.1415926535897932384626433832795
layout(location=${loc_aTexCoords}) in vec2 aTexCoords;
uniform mat4 MVP;
uniform vec3 uControlPoints[16];
uniform mat4 uConnectivity[16];
out vec2 vTexCoords;

float cubicB0(float t) { return ((1.0-t)*(1.0-t)*(1.0-t)) / 6.0; }
float cubicB1(float t) { return (3.0*t*t*t - 6.0*t*t + 4.0) / 6.0; }
float cubicB2(float t) { return ((-3.0)*t*t*t + 3.0*t*t + 3.0*t + 1.0) / 6.0; }
float cubicB3(float t) { return (t*t*t) / 6.0; }

float cubicB(int i, float t)
{
  switch (i) {
    case 0:
        return cubicB0(t);
    case 1:
        return cubicB1(t);
    case 2:
        return cubicB2(t);
    case 3:
        return cubicB3(t);
}

}

vec3 BSpline(vec2 coords)
{
  float u = coords[0];
  float v = coords[1];
  vec3 p = vec3(0, 0, 0);
  for(int i = 0; i < 4; i++) {
    for(int j = 0; j < 4; j++) {
      p += cubicB(i, u) * cubicB(j, v) * uControlPoints[int(uConnectivity[gl_InstanceID][i][j]) - 1];
    }
  }
  return p;
}

void main() 
{
  vec3 p = BSpline(aTexCoords);
  gl_Position = MVP * vec4(p, 1.0);
  vTexCoords = aTexCoords;
}


