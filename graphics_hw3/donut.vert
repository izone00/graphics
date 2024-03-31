#version 300 es
#define M_PI 3.1415926535897932384626433832795
layout(location=${loc_aTexCoords}) in vec2 aTexCoords;
uniform mat4 MVP;
uniform mat4 MV;
uniform vec3 uControlPoints[16];
uniform mat4 uConnectivity[16];
out vec3 vNormal;
out vec3 vTangentU;
out vec3 vTangentV;
out vec2 vTexCoords;

float cubicB0(float t) { return ((1.0-t)*(1.0-t)*(1.0-t)) / 6.0; }
float cubicB1(float t) { return (3.0*t*t*t - 6.0*t*t + 4.0) / 6.0; }
float cubicB2(float t) { return ((-3.0)*t*t*t + 3.0*t*t + 3.0*t + 1.0) / 6.0; }
float cubicB3(float t) { return (t*t*t) / 6.0; }

float cubicB0_D1(float t) { return -((1.0-t)*(1.0-t)) / 6.0; }
float cubicB1_D1(float t) { return (9.0*t*t - 12.0*t) / 6.0; }
float cubicB2_D1(float t) { return ((-9.0)*t*t + 6.0*t + 3.0) / 6.0; }
float cubicB3_D1(float t) { return (3.0*t*t) / 6.0; }

float cubicB(int i, float t)
{
  switch (i)
  {
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

float cubicB_D1(int i, float t)
{
  switch (i)
  {
    case 0:
        return cubicB0_D1(t);
    case 1:
        return cubicB1_D1(t);
    case 2:
        return cubicB2_D1(t);
    case 3:
        return cubicB3_D1(t);
  }
}

vec3 BSpline(vec2 coords)
{
  float u = 1.0 - coords[1];
  float v = coords[0];
  vec3 p = vec3(0, 0, 0);
  for(int i = 0; i < 4; i++)
  {
    for(int j = 0; j < 4; j++)
      p += cubicB(i, u) * cubicB(j, v) * uControlPoints[int(uConnectivity[gl_InstanceID][i][j]) - 1];
  }
  return p;
}

vec3 BSpline_Du(vec2 coords)
{
  float u = 1.0 - coords[1];
  float v = coords[0];
  vec3 tangent = vec3(0, 0, 0);
  for(int i = 0; i < 4; i++)
  {
    for(int j = 0; j < 4; j++)
      tangent += cubicB_D1(i, u) * cubicB(j, v) * uControlPoints[int(uConnectivity[gl_InstanceID][i][j]) - 1];
  }
  return tangent;
}

vec3 BSpline_Dv(vec2 coords)
{
  float u = 1.0 - coords[1];
  float v = coords[0];
  vec3 tangent = vec3(0, 0, 0);
  for(int i = 0; i < 4; i++)
  {
    for(int j = 0; j < 4; j++)
      tangent += cubicB(i, u) * cubicB_D1(j, v) * uControlPoints[int(uConnectivity[gl_InstanceID][i][j]) - 1];
  }
  return tangent;
}

void main() 
{
  vec3 p = BSpline(aTexCoords);
  gl_Position = MVP * vec4(p, 1.0);
  vec3 tangentU = (vec4(BSpline_Du(aTexCoords), 1.0)).xyz;
  vec3 tangentV = (vec4(BSpline_Dv(aTexCoords), 1.0)).xyz;
  vNormal = (MV * vec4(cross(tangentU, tangentV), 0.0)).xyz;

  vTexCoords = vec2(aTexCoords.s, aTexCoords.t);
  vTangentU = tangentU;
  vTangentV = tangentV;
}


