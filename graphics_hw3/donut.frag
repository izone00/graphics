#version 300 es
precision mediump float;
uniform sampler2D tex;

struct Light {
    vec3 direction;
    vec3 ambient;
    vec3 diffusive;
    vec3 specular;
};
uniform Light sun;
struct Material {
    vec3 ambient;
    vec3 diffusive;
    vec3 specular;
    float shininess;
};
uniform Material gold;

in vec2 vTexCoords;
in vec3 vNormal;
in vec3 vTangentU;
in vec3 vTangentV;
out vec4 fColor;
void main() 
{
    float bumpWeight = 0.05;
    float delta = 0.01;

    float uDeltaPlus = normalize(texture(tex, vTexCoords + vec2(delta, 0))).r;
    float uDeltaMinus = normalize(texture(tex, vTexCoords - vec2(delta, 0))).r;;
    float dTdu = (bumpWeight * (uDeltaPlus - uDeltaMinus)) / (2.0 * delta);

    float vDeltaPlus = normalize(texture(tex, vTexCoords + vec2(0, delta))).r;
    float vDeltaMinus = normalize(texture(tex, vTexCoords - vec2(0, delta))).r;
    float dTdv = (bumpWeight * (vDeltaPlus - vDeltaMinus)) / (2.0 * delta);

    vec3 bumpNormal = vNormal + dTdu * normalize(cross(vNormal, vTangentV)) - dTdv * normalize(cross(vNormal, vTangentU));

    float light = 0.0;
    light = max(0.0, dot(normalize(sun.direction), normalize(bumpNormal))) * 1.2;
    vec3 rgbColor = (sun.ambient * gold.ambient) + (sun.diffusive * gold.diffusive);
    fColor = vec4(rgbColor, 1.0);
    fColor.rgb *= light;
}

