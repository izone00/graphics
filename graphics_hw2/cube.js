import { loc_aColor, loc_aPosition } from "../glsl/glsl.js";

const BYTE_SIZE_OF_FLOAT32 = 4;

/**
 * @param {WebGL2RenderingContext} gl
 * */
function init_cube(gl) {
  // prettier-ignore
  const cubeVertexPositions = new Float32Array([
    3, 3, -3, 
    3, 3, 3,
    3, -3, 3,
    3, -3, -3, 
    
    -3, 3, 3, 
    -3, 3, -3,
    -3, -3, -3,
    -3, -3, 3, 

    -3, 3, 3, 
    3, 3, 3, 
    3, 3, -3, 
    -3, 3, -3, 

    -3, -3, -3, 
    3, -3, -3, 
    3, -3, 3, 
    -3, -3, 3, 

    3, 3, 3, 
    -3, 3, 3, 
    -3, -3, 3,
    3, -3, 3,
    
    -3, 3, -3, 
    3, 3, -3,
    3, -3, -3, 
    -3, -3, -3,
  ]);
  const colors = [];
  for (let i = 0; i < 8; i++) {
    colors.push(1, 0, 0, 1);
  }
  for (let i = 8; i < 16; i++) {
    colors.push(0, 1, 0, 1);
  }
  for (let i = 16; i < 24; i++) {
    colors.push(0, 0, 1, 1);
  }
  const cubeVertexIndices = new Uint16Array([
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
    15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
  ]);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const cubePositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubePositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, cubeVertexPositions, gl.STATIC_DRAW);

  gl.vertexAttribPointer(loc_aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(loc_aPosition);

  const orbitColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, orbitColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  gl.vertexAttribPointer(loc_aColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(loc_aColor);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndices, gl.STATIC_DRAW);

  gl.bindVertexArray(null);
  gl.disableVertexAttribArray(loc_aPosition);
  gl.disableVertexAttribArray(loc_aColor);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return vao;
}

export { BYTE_SIZE_OF_FLOAT32, init_cube };
