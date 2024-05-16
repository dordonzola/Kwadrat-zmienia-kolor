console.error("works");
const vertexShaderTxt = `
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`;
const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;

let gl;
let program;
let squareVertBuffer;
let squareVerts;

const Square = function () {
  const canvas = document.getElementById("main-canvas");
  gl = canvas.getContext("webgl");
  let canvasColor = [0.2, 0.5, 0.8];

  checkGl(gl);

  gl.clearColor(...canvasColor, 1.0); // R, G, B,  A
  gl.clear(gl.COLOR_BUFFER_BIT);

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderTxt);
  gl.shaderSource(fragmentShader, fragmentShaderTxt);

  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  checkShaderCompile(gl, vertexShader);

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);

  gl.validateProgram(program);

  squareVerts = [
    // X, Y      R   G    B
    -0.5,
    0.5,
    0.7,
    0.2,
    0.4, //
    -0.5,
    -0.5,
    0.7,
    0.2,
    0.4, //
    0.5,
    -0.5,
    0.7,
    0.2,
    0.4, //
    0.5,
    0.5,
    0.7,
    0.2,
    0.4,
  ];

  squareVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVerts), gl.STATIC_DRAW);

  const posAttribLocation = gl.getAttribLocation(program, "vertPosition");
  gl.vertexAttribPointer(
    posAttribLocation,
    2,
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.enableVertexAttribArray(posAttribLocation);

  const colorAttribLocation = gl.getAttribLocation(program, "vertColor");
  gl.vertexAttribPointer(
    colorAttribLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(colorAttribLocation);
  canvas.addEventListener("click", changeColor);

  // render time

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
};

function checkGl(gl) {
  if (!gl) {
    console.log("WebGL not suppoerted, use another browser");
  }
}

function checkShaderCompile(gl, shader) {
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("shader not compiled", gl.getShaderInfoLog(shader));
  }
}

function changeColor(nr) {
  for (let i = 0; i < 4; i++) {
    squareVerts[i * 5 + 2] -= 0.2; // R
    if (squareVerts[i * 5 + 2] < 0) {
      squareVerts[i * 5 + 2] += 1.0;
    }

    squareVerts[i * 5 + 3] += 0.2; // G
    if (squareVerts[i * 5 + 3] > 1) {
      squareVerts[i * 5 + 3] -= 1.0;
    }

    squareVerts[i * 5 + 4] -= 0.2; // B
    if (squareVerts[i * 5 + 4] < 0) {
      squareVerts[i * 5 + 4] += 1.0;
    }
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVerts), gl.STATIC_DRAW);

  // Narysuj kwadrat z nowym kolorem
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

  if (nr == 4) {
    nr = 0;
  }
  nr += 1;
  return nr;
}

function checkLink(gl, program) {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("linking error", gl.getProgramInfoLog(program));
  }
}
