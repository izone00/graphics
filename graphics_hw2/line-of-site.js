import { loc_aColor, loc_aPosition } from "./glsl.js";
import { Mesh } from "./mesh.js";
import { ORBIT_RADIUS } from "./orbit.js";

/**
 * @param {WebGL2RenderingContext} gl
 * */
function createLineOfSite(gl) {
  // prettier-ignore
  const vertices = [
    0, 0, 0,
    0, 0, ORBIT_RADIUS, 
  ];
  // prettier-ignore
  const colors = [
    1, 0.3, 1, 1,
    1, 0.3, 1, 1
  ];

  const lineOfSitePositions = new Float32Array(vertices);
  const lineOfSiteColors = new Float32Array(colors);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const lineOfSitePositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineOfSitePositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, lineOfSitePositions, gl.STATIC_DRAW);

  gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(loc_aPosition);

  const lineOfSiteColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineOfSiteColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, lineOfSiteColors, gl.STATIC_DRAW);

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
    draw_mode: gl.LINES,
    n: 2,
  });
}

export { createLineOfSite };
