/** @type {mat4} */
import * as mat4 from "./lib/gl-matrix/mat4.js";
/** @type {vec3} */
import * as vec3 from "./lib/gl-matrix/vec3.js";
/** @type {vec4} */
import * as vec4 from "./lib/gl-matrix/vec4.js";
import { toRadian } from "./lib/gl-matrix/common.js";
import { src_vert, src_frag } from "./glsl.js";
import { ORBIT_RADIUS, init_orbit } from "./orbit.js";
import { createLineOfSite } from "./line-of-site.js";
import { create_mesh_sphere } from "./create_mesh_sphere.js";
import { settings } from "./settings.js";

function main() {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("webgl");
  const gl = canvas.getContext("webgl2");
  gl.enable(gl.DEPTH_TEST);

  const h_prog = createProgram(gl, src_vert, src_frag);

  // uniform변수 가져오기
  const loc_MVP = gl.getUniformLocation(h_prog, "uMVP");
  const loc_M = gl.getUniformLocation(h_prog, "uM");
  const loc_worldPointLight = gl.getUniformLocation(h_prog, "uWorldPointLight");
  const loc_worldSpotLight = gl.getUniformLocation(h_prog, "uWorldSpotLight");
  const loc_worldViewPosition = gl.getUniformLocation(
    h_prog,
    "uWorldViewPosition"
  );
  const loc_bumpHeight = gl.getUniformLocation(h_prog, "uBumpHeight");
  const loc_spotLightDirection = gl.getUniformLocation(
    h_prog,
    "uSpotLightDirection"
  );
  const loc_pointLightShininess = gl.getUniformLocation(
    h_prog,
    "uPointLightShininess"
  );
  const loc_spotLightShininess = gl.getUniformLocation(
    h_prog,
    "uSpotLightShininess"
  );
  const loc_spotLightCutoffAngle = gl.getUniformLocation(
    h_prog,
    "uSpotLightCutoffAngle"
  );
  const loc_useColor = gl.getUniformLocation(h_prog, "uUseColor");
  const loc_color = gl.getUniformLocation(h_prog, "uColor");
  const loc_mapImage = gl.getUniformLocation(h_prog, "uMapImage");
  const loc_bumpImage = gl.getUniformLocation(h_prog, "uBumpImage");
  const loc_specImage = gl.getUniformLocation(h_prog, "uSpecImage");

  // texture 초기화
  {
    const textures = [
      { src: "resources/earthmap1k.jpg", uniform: loc_mapImage },
      { src: "resources/earthbump1k.jpg", uniform: loc_bumpImage },
      { src: "resources/earthspec1k.jpg", uniform: loc_specImage },
    ];
    Promise.all(
      textures.map((texture) => {
        return new Promise((resolve) => {
          const image = new Image();
          image.addEventListener("load", () => {
            resolve(image);
          });
          image.src = texture.src;
        });
      })
    ).then((images) => {
      images.forEach((image, index) => {
        gl.uniform1i(textures[index].uniform, index);
        const texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + index);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image
        );
        gl.generateMipmap(gl.TEXTURE_2D);
      });
    });
  }

  // vao 생성
  const earth = create_mesh_sphere(gl, 250);
  const orbit = init_orbit(gl);
  const colorRed = vec4.fromValues(1, 0, 0, 1);
  const colorGreen = vec4.fromValues(0, 1, 0, 1);
  const colorBlue = vec4.fromValues(0, 0, 1, 1);
  const lineOfSite = createLineOfSite(gl);

  // 전역 변수
  const clearColor = [0.1, 0.1, 0.1, 1.0];
  const worldViewPosition = vec3.fromValues(30, 10, 30);
  const worldPointLight = vec3.fromValues(15, 35, 15);

  const P = mat4.create();
  const V = mat4.create();
  const VP = mat4.create();
  mat4.perspective(P, toRadian(30), canvas.width / canvas.height, 1, 100);
  mat4.lookAt(V, worldViewPosition, [0, 0, 0], [0, 1, 0]);
  mat4.multiply(VP, P, V);

  // 전역 uniform 변수 초기화
  gl.useProgram(h_prog);
  gl.uniform1i(loc_useColor, false);

  function updateGlobalUniform() {
    gl.useProgram(h_prog);
    gl.uniform3fv(loc_worldPointLight, worldPointLight);
    gl.uniform3fv(loc_worldViewPosition, worldViewPosition);
    gl.uniform1f(loc_pointLightShininess, settings.isPointRightOn ? 1.0 : 0.0);
    gl.uniform1f(loc_spotLightShininess, settings.isSpotRightOn ? 1.0 : 0.0);
    gl.uniform1f(loc_bumpHeight, settings.height);
    gl.uniform1f(loc_spotLightCutoffAngle, toRadian(settings.cutoffAngle));
  }

  function drawEarth() {
    const M = mat4.create();
    const MVP = mat4.create();
    mat4.rotate(M, M, toRadian(settings.angle), [0, 1, 0]);
    mat4.rotate(M, M, toRadian(90), [-1, 0, 0]);
    mat4.multiply(MVP, VP, M);
    earth.drawElements({
      prog: h_prog,
      uniforms: {
        MVP: { location: loc_MVP, value: MVP },
        M: { location: loc_M, value: M },
      },
      viewport: { x: 0, y: 0, width: canvas.width / 2, height: canvas.height },
    });
  }
  function drawOrbit() {
    const M = mat4.create();
    const MVP = mat4.create();
    mat4.rotate(M, M, toRadian(settings.longitude), [0, 1, 0]);
    mat4.multiply(MVP, VP, M);
    gl.uniform1i(loc_useColor, true);
    gl.uniform4fv(loc_color, colorRed);
    orbit.drawArrays({
      prog: h_prog,
      uniforms: {
        MVP: { location: loc_MVP, value: MVP },
        M: { location: loc_M, value: M },
      },
      viewport: { x: 0, y: 0, width: canvas.width / 2, height: canvas.height },
      first: 0,
      count: orbit.n / 2,
    });
    gl.uniform4fv(loc_color, colorBlue);
    orbit.drawArrays({
      prog: h_prog,
      uniforms: {
        MVP: { location: loc_MVP, value: MVP },
        M: { location: loc_M, value: M },
      },
      viewport: { x: 0, y: 0, width: canvas.width / 2, height: canvas.height },
      first: orbit.n / 2,
      count: orbit.n / 2,
    });
    gl.uniform1i(loc_useColor, false);
  }
  function drawLineOfSite() {
    const M = mat4.create();
    const MVP = mat4.create();
    mat4.rotateY(M, M, toRadian(settings.longitude));
    mat4.rotateX(M, M, toRadian(-settings.latitude));
    mat4.multiply(MVP, VP, M);

    let worldSpotLight = vec4.fromValues(0, 0, ORBIT_RADIUS, 1);
    vec4.transformMat4(worldSpotLight, worldSpotLight, M);
    worldSpotLight = vec3.clone(worldSpotLight);
    gl.uniform3fv(loc_worldSpotLight, worldSpotLight);

    const spotLightDirection = vec3.create();
    vec3.subtract(spotLightDirection, spotLightDirection, worldSpotLight);
    gl.uniform3fv(loc_spotLightDirection, spotLightDirection);

    gl.uniform1i(loc_useColor, true);
    gl.uniform4fv(loc_color, colorGreen);
    lineOfSite.drawArrays({
      prog: h_prog,
      uniforms: {
        MVP: { location: loc_MVP, value: MVP },
        M: { location: loc_M, value: M },
      },
      viewport: { x: 0, y: 0, width: canvas.width / 2, height: canvas.height },
      first: 0,
      count: lineOfSite.n,
    });
    gl.uniform1i(loc_useColor, false);
  }
  function drawSatellite() {
    const V = mat4.create();
    const M = mat4.create();
    const VP = mat4.create();
    const MVP = mat4.create();
    mat4.translate(V, V, [0, 0, -10]);
    mat4.rotateX(V, V, toRadian(settings.latitude));
    mat4.rotateY(V, V, toRadian(-settings.longitude));
    mat4.multiply(VP, P, V);
    mat4.rotate(M, M, toRadian(settings.angle), [0, 1, 0]);
    mat4.rotate(M, M, toRadian(90), [-1, 0, 0]);
    mat4.multiply(MVP, VP, M);

    earth.drawElements({
      prog: h_prog,
      uniforms: {
        MVP: { location: loc_MVP, value: MVP },
        M: { location: loc_M, value: M },
      },
      viewport: {
        x: canvas.width / 2,
        y: 0,
        width: canvas.width / 2,
        height: canvas.height,
      },
    });
  }

  function renderScene() {
    updateGlobalUniform();
    gl.clearColor(...clearColor);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawEarth();
    drawOrbit();
    drawLineOfSite();
    drawSatellite();

    requestAnimationFrame(renderScene);
  }

  renderScene();
}

function createProgram(gl, src_vert, src_frag) {
  function compileShader(gl, type, src) {
    let shader = gl.createShader(type);
    if (!shader) {
      console.log("Compile Error: Failed to create a shader.");
      return null;
    }

    gl.shaderSource(shader, src);

    gl.compileShader(shader);

    let status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!status) {
      let err = gl.getShaderInfoLog(shader);
      console.log(`Compilation Error: ${err}`);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  let h_vert = compileShader(gl, gl.VERTEX_SHADER, src_vert);
  const h_frag = compileShader(gl, gl.FRAGMENT_SHADER, src_frag);
  if (!h_vert || !h_frag) return null;

  let h_prog = gl.createProgram();
  if (!h_prog) return null;

  gl.attachShader(h_prog, h_vert);
  gl.attachShader(h_prog, h_frag);
  gl.linkProgram(h_prog);

  let status = gl.getProgramParameter(h_prog, gl.LINK_STATUS);
  if (!status) {
    let err = gl.getProgramInfoLog(h_prog);
    console.log(`Link Error: ${err}`);
    gl.deleteProgram(h_prog);
    gl.deleteShader(h_vert);
    gl.deleteShader(h_frag);
    return null;
  }
  return h_prog;
}

main();
