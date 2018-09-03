THREE.LUTShader = {
  uniforms: {
      tDiffuse: {
          type: "t",
          value: null
      },
      lookupTable: {
          type: "t",
          value: null
      },
      strength: {
          type: "f",
          value: 1
      }
  },
  vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
  fragmentShader: ["uniform sampler2D tDiffuse;", "uniform sampler2D lookupTable;", "uniform float strength;", "varying vec2 vUv;", "void main() {", "vec4 col = texture2D( tDiffuse, vUv );", "float blueColor = col.b * 63.0;", "vec2 quad1;", "quad1.y = floor(floor(blueColor) / 8.0);", "quad1.x = floor(blueColor) - (quad1.y * 8.0);", "vec2 quad2;", "quad2.y = floor(ceil(blueColor) / 8.0);", "quad2.x = ceil(blueColor) - (quad2.y * 8.0);", "vec2 texPos1;", "texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * col.r);", "texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * col.g);", "texPos1.y = 1.0-texPos1.y;", "vec2 texPos2;", "texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * col.r);", "texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * col.g);", "texPos2.y = 1.0-texPos2.y;", "vec4 newColor1 = texture2D(lookupTable, texPos1);", "vec4 newColor2 = texture2D(lookupTable, texPos2);", "vec4 newColor = mix(newColor1, newColor2, fract(blueColor));", "gl_FragColor = mix(col, vec4(newColor.rgb, col.w), strength);", "}"].join("\n")
}

/*

var d = [];
var m = ["lookup_miss_etikate.png", "lookup_amatorka.png", "lookup_soft_elegance_1.png", "lookup_soft_elegance_2.png"];
var e = new THREE.TextureLoader;

for (var t = 0; t < m.length; t++) {
    var r = e.load("res/lut/" + m[t]);
    r.genMipmaps = !1,
    r.minFilter = THREE.LinearFilter,
    r.magFilter = THREE.LinearFilter,
    r.wrapS = THREE.ClampToEdgeWrapping,
    r.wrapT = THREE.ClampToEdgeWrapping,
    d.push(r)
}
f.lut.uniforms.lookupTable.value = d[0],



*/