import { loc_aColor, loc_aPosition } from "./glsl.js";
import { Mesh } from "./mesh.js";

const ORBIT_DIV = 24;
const ORBIT_RADIUS = 10;

/**
 * @param {WebGL2RenderingContext} gl
 * */
function init_orbit(gl) {
  const vertices = [];
  const colors = [];
  for (let i = 0; i < ORBIT_DIV; i++) {
    const theta = (i / ORBIT_DIV) * (2 * Math.PI);
    const x = ORBIT_RADIUS * Math.cos(theta);
    const y = ORBIT_RADIUS * Math.sin(theta);
    vertices.push(0, x, y);
    colors.push(0, 0, 1, 1);
  }
  for (let i = 0; i < ORBIT_DIV; i++) {
    const theta = (i / ORBIT_DIV) * (2 * Math.PI);
    const x = ORBIT_RADIUS * Math.cos(theta);
    const y = ORBIT_RADIUS * Math.sin(theta);
    vertices.push(x, 0, y);
    colors.push(0, 1, 1, 1);
  }

  const orbitVertexPositions = new Float32Array(vertices);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const orbitPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, orbitPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, orbitVertexPositions, gl.STATIC_DRAW);

  gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(loc_aPosition);

  const orbitColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, orbitColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  gl.vertexAttribPointer(loc_aColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(loc_aColor);

  gl.bindVertexArray(null);
  gl.disableVertexAttribArray(loc_aPosition);
  gl.disableVertexAttribArray(loc_aColor);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return new Mesh({
    gl,
    vao,
    draw_call: "drawArrays",
    draw_mode: gl.LINE_LOOP,
    n: ORBIT_DIV * 2,
  });
}

export { init_orbit, ORBIT_DIV, ORBIT_RADIUS };
