class Mesh {
  /**
   * @param {Object} options - Mesh 렌더링 옵션 객체
   * @param {WebGLRenderingContext} options.gl - webGL 컨텍스트
   * @param {WebGLVertexArrayObject} options.vao - 렌더링에 사용할 VAO (Vertex Array Object)
   * @param {string} options.draw_call - 렌더링 함수 이름
   * @param {string} options.draw_mode - 렌더링 방식
   * @param {number} options.n - 렌더링 Vectex 개수
   * @param {number} options.index_buffer_type - 렌더링 버퍼 타입
   */
  constructor(options) {
    const {
      gl,
      vao,
      draw_call,
      draw_mode,
      n,
      index_buffer,
      index_buffer_type = null,
    } = options;
    this.gl = gl;
    this.vao = vao;
    this.draw = this[draw_call];
    this.drawMode = draw_mode;
    this.n = n;
    this.indexBuffer = index_buffer;
    this.indexBufferType = index_buffer_type;
  }

  /**
   * @param {Object} params - 렌더링에 필요한 매개변수 객체
   * @param {WebGLProgram} params.prog - 사용할 픽셀 셰이더 프로그램
   * @param {Object} params.uniforms - 셰이더에 전달할 uniform 변수들
   * @param {Object} params.uniforms.M - Model matrix
   * @param {Object} params.uniforms.MVP - MVP matrix
   * @param {Object} params.viewport - 렌더링 하는 viewport 옵션
   * @param {number} params.viewport.x
   * @param {number} params.viewport.y
   * @param {number} params.viewport.width
   * @param {number} params.viewport.height
   */
  drawElements(params) {
    const { gl, vao, drawMode, n, indexBufferType } = this;
    const { prog, uniforms, viewport } = params;

    gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
    gl.useProgram(prog);
    gl.uniformMatrix4fv(uniforms.M.location, false, uniforms.M.value);
    gl.uniformMatrix4fv(uniforms.MVP.location, false, uniforms.MVP.value);
    gl.bindVertexArray(vao);
    gl.drawElements(drawMode, n, indexBufferType, 0);
    gl.bindVertexArray(null);
  }

  /**
   * @param {Object} params - 렌더링에 필요한 매개변수 객체
   * @param {WebGLProgram} params.prog - 사용할 픽셀 셰이더 프로그램
   * @param {Object} params.uniforms - 셰이더에 전달할 uniform 변수들
   * @param {Object} params.uniforms.M - Model matrix
   * @param {Object} params.uniforms.MVP - MVP matrix
   * @param {Object} params.viewport - 렌더링 하는 viewport 옵션
   * @param {number} params.viewport.x
   * @param {number} params.viewport.y
   * @param {number} params.viewport.width
   * @param {number} params.viewport.height
   * @param {number} params.first
   * @param {number} params.count
   */
  drawArrays(params) {
    const { gl, vao, drawMode, n, indexBuffer } = this;
    const { prog, uniforms, viewport, first = 0, count = n } = params;

    gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
    gl.useProgram(prog);
    gl.uniformMatrix4fv(uniforms.M.location, false, uniforms.M.value);
    gl.uniformMatrix4fv(uniforms.MVP.location, false, uniforms.MVP.value);
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawArrays(drawMode, first, count);
    gl.bindVertexArray(null);
  }
}

export { Mesh };
