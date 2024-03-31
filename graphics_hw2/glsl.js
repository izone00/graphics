import { SPHERE_RADIUS } from "./create_mesh_sphere.js";

const loc_aPosition = 0;
const loc_aNormal = 1;
const loc_aTexCoord = 2;
const loc_aColor = 3;

const src_vert = /*glsl*/ `#version 300 es
layout(location=${loc_aPosition}) in vec4 aPosition;
layout(location=${loc_aNormal}) in vec3 aNormal;
layout(location=${loc_aTexCoord}) in vec2 aTexCoord;
uniform mat4 uMVP;
uniform mat4 uM;
uniform vec3 uWorldPointLight;
uniform vec3 uWorldSpotLight;
uniform vec3 uWorldViewPosition;
uniform float uBumpHeight;
uniform sampler2D uBumpImage;
out vec3 vNormal;
out vec3 vSurfaceToPointLight;
out vec3 vSurfaceToSpotLight;
out vec3 vSurfaceToView;
out vec3 vPointLightDirection;
out vec2 vTexCoord;
void main() 
{
    vTexCoord = vec2(aTexCoord.x, 1.0 - aTexCoord.y);

    float bump = normalize(texture(uBumpImage, vTexCoord)).r;
    float bumpWeight = 0.02 * uBumpHeight;
    bump *= bumpWeight;
    bump += 1.0;

    vec4 bumpPosition = aPosition * vec4(vec3(bump), 1);
    gl_Position = uMVP * bumpPosition;

    float PI = 3.141592;
    float r = ${SPHERE_RADIUS}.0 + bump;
    float theta = 2.0 * PI * vTexCoord[0];
    float phi = PI * vTexCoord[1];

    float delta = 0.0001;

    float sDeltaPlus = normalize(texture(uBumpImage, vTexCoord + vec2(delta, 0))).r;
    float sDeltaMinus = normalize(texture(uBumpImage, vTexCoord - vec2(delta, 0))).r;;
    float drds = (bumpWeight * (sDeltaPlus - sDeltaMinus)) / (2.0 * delta);

    float tDeltaPlus = normalize(texture(uBumpImage, vTexCoord + vec2(0, delta))).r;
    float tDeltaMinus = normalize(texture(uBumpImage, vTexCoord - vec2(0, delta))).r;
    float drdt = (bumpWeight * (tDeltaPlus - tDeltaMinus)) / (2.0 * delta);

    vec3 dPds = vec3(-r*sin(theta)*sin(phi)*2.0*PI + drds*cos(theta)*sin(phi),
                     r*cos(theta)*sin(phi)*2.0*PI + drds*sin(theta)*sin(phi),
                     drds*cos(phi));
    vec3 dPdt = vec3(r*cos(theta)*cos(phi)*(-PI) + drdt*cos(theta)*sin(phi),
                     r*sin(theta)*cos(phi)*(-PI) + drdt*sin(theta)*sin(phi),
                     -r*sin(phi)*(-PI) + drdt*cos(phi));

    vNormal = cross(dPds, dPdt);
    vNormal = normalize(mat3(uM) * vNormal);

    vec3 worldPosition = (uM * bumpPosition).xyz;

    vSurfaceToPointLight = normalize(uWorldPointLight - worldPosition);
    vSurfaceToSpotLight = normalize(uWorldSpotLight - worldPosition);
    vSurfaceToView = normalize(uWorldViewPosition - worldPosition);
    vPointLightDirection = -normalize(uWorldPointLight);
}`;

const src_frag = /*glsl*/ `#version 300 es
precision mediump float;
uniform vec3 uSpotLightDirection;
uniform float uPointLightShininess;
uniform float uSpotLightShininess;
uniform float uSpotLightCutoffAngle;
uniform bool uUseColor;
uniform vec4 uColor;
uniform sampler2D uMapImage;
uniform sampler2D uSpecImage;
in vec3 vNormal;
in vec3 vSurfaceToPointLight;
in vec3 vSurfaceToSpotLight;
in vec3 vSurfaceToView;
in vec3 vPointLightDirection;
in vec2 vTexCoord;
out vec4 fColor;
void main() 
{
    // pointLight diffusive
    float pointLight = max(0.0, dot(vNormal, vSurfaceToPointLight) * uPointLightShininess);

    // pointLight specular
    vec3 pointLightReflect = 2.0 * dot(vNormal, vSurfaceToPointLight) * vNormal - vSurfaceToPointLight;
    float pointLightSpecular = pow(dot(vNormal, pointLightReflect), 100.0) * texture(uSpecImage, vTexCoord).r * uPointLightShininess;
    if (dot(vNormal, pointLightReflect) < 0.0)
        pointLightSpecular = 0.0;
    
    // spotLight diffusive
    float dotSpotLightDirection = dot(vSurfaceToSpotLight, -normalize(uSpotLightDirection));
    float inLight = step(cos(uSpotLightCutoffAngle), dotSpotLightDirection);
    float spotLight = inLight * max(0.0, dot(vNormal, vSurfaceToSpotLight) * uSpotLightShininess);

    //spotLight specular
    vec3 spotLightReflect = 2.0 * dot(vNormal, vSurfaceToSpotLight) * vNormal - vSurfaceToSpotLight;
    float spotLightSpecular = inLight * pow(dot(vNormal, spotLightReflect), 100.0) * texture(uSpecImage, vTexCoord).r * uSpotLightShininess;
    if (dot(vNormal, spotLightReflect) < 0.0)
        spotLightSpecular = 0.0;
    
    float light = pointLight + spotLight;
    float specular = pointLightSpecular + spotLightSpecular;

    fColor = texture(uMapImage, vTexCoord);
    fColor.rgb *= light;
    fColor.rgb += specular;

    // 고정색 처리
    if (uUseColor)
        fColor = uColor;
}`;

export {
  loc_aColor,
  loc_aPosition,
  loc_aNormal,
  loc_aTexCoord,
  src_frag,
  src_vert,
};
