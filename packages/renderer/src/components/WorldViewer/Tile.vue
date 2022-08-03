<template>
	<div :class="['tile', tile.img ? '' : 'tile-loading']">
		<div v-show="!loading" ref="grid" class="tile-overlay" @click="click">
			<div v-for="i of 1024" :key="i" class="tile-chunk" :data-id="i"/>
		</div>
		<div v-if="loading" class="flex items-center justify-center border-2 h-full w-full">
			<h1 class="m-0">Loading {{ tile.path }}</h1>
		</div>
		<div v-show="!loading" class="tile-content">
			<canvas ref="view" width="512" height="512"/>
			<canvas ref="render" width="512" height="512"/>
		</div>
	</div>
</template>

<script>
import Vector3 from '#main/math/Vector3';
import Renderer from '@/js/renderer';
import Buffer from 'buffer';

const fromHex = (hex) => {
	const res = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,
		(m, r, g, b) => '#' + r + r + g + g + b + b)
	if (res !== null) {
		return res.substring(1).match(/.{2}/g)?.map(x => parseInt(x, 16)/255) ?? [0, 0, 0]
	}
	return [0, 0, 0]
}

export default {
	name: 'Tile',
	props: {
		tile: {
			required: true,
			type: Object,
		},
		showGrid: Boolean,
		sun: {
			raw: Array,
			vector: Array,
		},
		colors: {
			highlight: String,
			shadow: String,
		},
	},
	data() {
		return {
			hasMounted: false,
			loading: true,
			image: undefined,

			type: 'blocks',
			lighting: false,

			maps: {
				color: [],
				height: [],
				normal: [],
			},
			dataMaps: {
				height: undefined,
			},

			directLighting: undefined,
		}
	},
	computed: {
		sunView() {
			return Vector3.fromArray([parseFloat(this.sun[0]), parseFloat(this.sun[1]), parseFloat(this.sun[2])] ?? [1, 1, 1]).normalize()
		},
	},
	watch: {
		tile: {
			deep: true,
			handler() {
				if (this.tile.img && this.hasMounted) this.loadImage()
			},
		},
		sun: {
			deep: true,
			handler() {
				this.updateProps()
			},
		},
		colors: {
			deep: true,
			handler() {
				this.updateProps()
			},
		},
	},
	mounted() {
		this.hasMounted = true
		if (this.tile.img) this.loadImage()
	},
	unmounted() {
		this.directLighting = null
	},
	methods: {
		async loadImage() {
			console.log('Loading', this.tile.path);
			console.time(this.tile.path)
			this.maps = await window.api.worldViewer.calcMaps(this.tile.img)

			// const SIZE = 512
	// 		const regl = REGL({ canvas: this.$refs.original });
	//
	// 		const fboNormal = regl.texture({
	// 			data: this.maps.normal,
	// 		});
	//
	// 		const cmdDirect = regl({
	// 			vert: `
    //   precision highp float;
    //   attribute vec2 position;
	//
    //   void main() {
    //     gl_Position = vec4(position, 0, 1);
    //   }
    // `,
	// 			frag: `
    //   precision highp float;
	//
    //   uniform sampler2D tNormal;
    //   uniform vec2 resolution;
    //   uniform vec3 sunDirection;
	//
    //   void main() {
    //     vec2 dr = 1.0/resolution;
    //     vec3 n = texture2D(tNormal, gl_FragCoord.xy/resolution).rgb;
    //     float l = dot(n, sunDirection);
    //     l = 0.5 * l + 0.5;
    //     gl_FragColor = vec4(l, l, l, 1.0);
    //   }
    // `,
	// 			attributes: {
	// 				position: [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1],
	// 			},
	// 			uniforms: {
	// 				tNormal: fboNormal,
	// 				resolution: [SIZE, SIZE],
	// 				sunDirection: new Vector3(1, 1, 1).normalize().asArray(),
	// 			},
	// 			viewport: { x: 0, y: 0, width: SIZE, height: SIZE },
	// 			count: 6,
	// 		});
	//
	// 		cmdDirect()

			const vs = `
    precision highp float;
    attribute vec2 position;

    void main() {
      gl_Position = vec4(position, 0, 1);
    }
`;

// 			const fs = `
//       precision highp float;
//
//       uniform sampler2D tNormal;
//       uniform sampler2D tColor;
//       uniform sampler2D tWaterColor;
//       uniform sampler2D tWaterFogColor;
//       uniform vec2 resolution;
//       uniform vec3 sunDirection;
//
//       void main() {
//         vec2 dr = 1.0/resolution;
//         vec3 n = texture2D(tNormal, gl_FragCoord.xy/resolution).rgb;
//         vec3 c = texture2D(tColor, gl_FragCoord.xy/resolution).rgb;
//         vec3 waterC = texture2D(tWaterColor, gl_FragCoord.xy/resolution).rgb;
//         vec3 waterFogC = texture2D(tWaterFogColor, gl_FragCoord.xy/resolution).rgb;
//         float waterHeight = texture2D(tWaterColor, gl_FragCoord.xy/resolution).a + texture2D(tWaterFogColor, gl_FragCoord.xy/resolution).a;
//         float l = dot(n, sunDirection);
//         l = 0.5 * l + 0.5;
//         //gl_FragColor = vec4(l, l, l, 1.0);
//
//         c = l * pow(c, vec3(2.0));
//
// 		if (waterHeight > 0.0) {
// 			vec3 tmp = c;
// 			tmp *= waterFogC;
// 			c = tmp * 0.75 + c * 0.25;
//
// 			c = (c + waterC - c * waterC) * 0.4 + c * 0.6;
// 		}
//
//         c = pow(c, vec3(1.0 / 2.2));
//         gl_FragColor = vec4(c, 1.0);
//       }
// `;
// 			const fs = `
//       precision highp float;
//
//       uniform sampler2D tNormal;
//       uniform sampler2D tColor;
//       uniform sampler2D tWaterColor;
//       uniform sampler2D tWaterFogColor;
//       uniform vec2 resolution;
//       uniform vec3 sunDirection;
//       uniform vec3 highlightColor;
//       uniform vec3 shadowColor;
//
//       void main() {
//         vec2 dr = 1.0/resolution;
//         vec3 n = 2.0 * texture2D(tNormal, gl_FragCoord.xy/resolution).rgb - 1.0;
//         vec3 c = texture2D(tColor, gl_FragCoord.xy/resolution).rgb;
//         vec3 waterC = texture2D(tWaterColor, gl_FragCoord.xy/resolution).rgb;
//         vec3 waterFogC = texture2D(tWaterFogColor, gl_FragCoord.xy/resolution).rgb;
//         float waterHeight = texture2D(tWaterColor, gl_FragCoord.xy/resolution).a + texture2D(tWaterFogColor, gl_FragCoord.xy/resolution).a;
//         float l = dot(n, sunDirection);
//         //l = 0.5 * l + 0.5;
//
//         c = pow(c, vec3(2.0));
//
//         float shadowM = l > 0.0 ? 0.0 : -l;
//         //vec3 shadowColor = vec3(0.2, 0.2, 0.2);
//         float highlightM = l < 0.0 ? 0.0 : l;
//         //vec3 highlightColor = vec3(1.125, 1.0, 0.875) * 1.5;
//         vec3 highlightC = highlightColor * 2.0;
//
//         c = c * shadowM * shadowColor + c * (1.0 - shadowM);
//         c = c * highlightM * highlightC + c * (1.0 - highlightM);
//
//
//         //gl_FragColor = vec4(l, l, l, 1.0);
//
// 		if (waterHeight > 0.0) {
// 			vec3 tmp = c;
// 			tmp *= waterFogC;
// 			c = tmp * 0.75 + c * 0.25;
//
// 			//c = (c + waterC - c * waterC) * 0.4 + c * 0.6;//Screen
// 			c = waterC * 0.4 + c * 0.6;//Copy
// 		}
//
//         c = pow(c, vec3(1.0 / 2.2));
//         gl_FragColor = vec4(c, 1.0);
//       }
// `;
			const fs = `
		precision highp float;

		uniform sampler2D tNormal;
		uniform sampler2D tColor;
		uniform sampler2D tHeight;
		uniform sampler2D tWaterColor;
		uniform sampler2D tWaterFogColor;
		uniform vec2 resolution;
		uniform vec2 sunPosition;
		uniform vec3 sunDirection;
		uniform vec3 highlightColor;
		uniform vec3 shadowColor;

		vec2 PointOnLine(vec2 start, float angle, float length) {
		    float x = length * cos(angle);
		    float y = length * sin(angle);

		    return vec2(start.x + x, start.y + y);
		}

		float PixelHeightAtPoint(vec2 texCoord, float LightAngleXY, float distance,sampler2D heightMap) {
		    vec2 newTexCoord = PointOnLine(texCoord, LightAngleXY, distance);
		    return texture2D(heightMap, newTexCoord).r;
		}

		float GetRayHeightAtPoint(float height, float LightAngleZ, float distance) {
		    return distance * tan(LightAngleZ) + height;
		}

		float TraceLight(float LightAngleXY, float LightAngleZ, sampler2D heightMap, vec2 texCoord, float step) {
		    float distance; // current distance along the line from current heightmap pixel towards the light
		    float currentHeight; // value of currently tested heightmap pixel
		    float newHeight; // values of heightmap pixels lying somewhere on the line towards the light from current position
		    float rayHeight; // height of a ray drawn from currentHeight along the light Z angle, sampled at a certain position

		    currentHeight = texture2D(heightMap, texCoord).r;

		    for (int i = 0; i < 100; ++i) {
		        distance = step * float(i);
		        newHeight = PixelHeightAtPoint(texCoord, LightAngleXY, distance, heightMap);

		        if (newHeight > currentHeight) { // there's a higher point on the line from current pixel to light
		            rayHeight = GetRayHeightAtPoint(currentHeight, LightAngleZ, distance);
		            if (rayHeight <= newHeight) { // the higher point also blocks the direct visibility from light to current pixel,  current pixel is in shadow
		                return 0.0 + (distance * 5.0);
		            }
		        }
		    }

		    return 1.0; // pixel is not occluded
		}

		void main() {
			vec2 dr = 1.0/resolution;
			vec3 n = 2.0 * texture2D(tNormal, gl_FragCoord.xy/resolution).rgb - 1.0;
			vec3 c = texture2D(tColor, gl_FragCoord.xy/resolution).rgb;
			vec3 waterC = texture2D(tWaterColor, gl_FragCoord.xy/resolution).rgb;
			vec3 waterFogC = texture2D(tWaterFogColor, gl_FragCoord.xy/resolution).rgb;
			float waterHeight = texture2D(tWaterColor, gl_FragCoord.xy/resolution).a + texture2D(tWaterFogColor, gl_FragCoord.xy/resolution).a;
			float l = dot(n, sunDirection);

			c = pow(c, vec3(2.0));

			float shadowM = l > 0.0 ? 0.0 : -l;
			float highlightM = l < 0.0 ? 0.0 : l;
			vec3 highlightC = highlightColor * 2.0;

			c = c * shadowM * shadowColor + c * (1.0 - shadowM);
			c = c * highlightM * highlightC + c * (1.0 - highlightM);

			if (waterHeight > 0.0) {
				vec3 tmp = c;
				float waterMask = pow(waterHeight * 4.5, 0.25);
				tmp *= waterFogC;
				c = tmp * waterMask + c * (1.0 - waterMask);

				//c = (c + waterC - c * waterC) * 0.4 + c * 0.6;//Screen
				c = waterC * 0.5 + c * 0.5;//Copy
			}

			// Shadows
			float LightZ = sunPosition[0];
			float LightXY = sunPosition[1];
			if (LightZ == 90.0) {
				LightZ = 89.9;
			}
			else if (LightZ > 90.0) {
				LightZ = 180.0 - LightZ;
				LightXY -= 180.0;
			}
			if (LightZ < 0.005) {
				LightZ = 0.005;
			}
			LightZ = radians(LightZ);
			LightXY = radians(LightXY);

			float lightLevel = 1.0 - TraceLight(LightXY, LightZ, tHeight, gl_FragCoord.xy/resolution, 0.0025);
			if (lightLevel > 0.0) {
				if (waterHeight == 0.0) {
					c = c * lightLevel * shadowColor + c * (1.0 - lightLevel);
				}
				else {
					float mask = lightLevel * 0.7;
					c = c * mask * waterFogC + c * (1.0 - mask);
				}
			}

			//Sunrise colors
			if (1.0 - sunPosition[0] / 45.0 > 0.0) {
				float mask = 1.0 - sunPosition[0] / 45.0;
				c = c * vec3(1.5, 0.9, 0.3) * mask + c * (1.0 - mask);
			}
			//Sunset colors
			if ((sunPosition[0] - 135.0) / 45.0 > 0.0) {
				float mask = (sunPosition[0] - 135.0) / 45.0;
			    float luma = c.x * 0.2126 + c.y * 0.7152 + c.z * 0.0722;
				vec3 tmp = (c - luma) * 0.75 + luma;
				tmp *= vec3(0.07, 0.152, 0.394);
				c = tmp * mask + c * (1.0 - mask);
			}

			c = pow(c, vec3(1.0 / 2.2));
			gl_FragColor = vec4(c, 1.0);
			// float h = texture2D(tHeight, gl_FragCoord.xy/resolution).r;
			// gl_FragColor = vec4(h, h, h, 1.0);
		}
`;
			// const tilesAcross = 8;
			// const tilesDown = 4;
			//
			// const m4 = twgl.m4;
			// const gl = this.$refs.original.getContext('webgl');
			//
			//
			// const tileHeight = twgl.createTexture(gl, {
			// 	src: this.maps.height,
			// 	width: SIZE,
			// 	height: SIZE,
			// });
			// const tileNormal = twgl.createTexture(gl, {
			// 	src: this.maps.normal,
			// 	width: SIZE,
			// 	height: SIZE,
			// });
			//
			//
			// // compile shaders, link, look up locations
			// const programInfo = twgl.createProgramInfo(gl, [vs, fs]);
			// // gl.createBuffer, bindBuffer, bufferData
			// const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
			// 	position: {
			// 		numComponents: 2,
			// 		data: [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1,],
			// 	},
			// });
			//
			//
			// function render() {
			// 	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			// 	gl.clearColor(1, 1, 1, 1);
			// 	gl.clear(gl.COLOR_BUFFER_BIT);
			//
			// 	gl.useProgram(programInfo.program);
			// 	twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
			//
			// 	const mat = m4.ortho(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
			// 	m4.scale(mat, [gl.canvas.width, gl.canvas.height, 1], mat);
			//
			//
			// 	const tmat = m4.identity();
			//
			// 	twgl.setUniforms(programInfo, {
			// 		u_matrix: mat,
			// 		u_texMatrix: tmat,
			// 		tElevation: tileHeight,
			// 		tNormal: tileNormal,
			// 		u_tilesetSize: [tilesAcross, tilesDown],
			// 		elevationScale: 1,
			// 		resolution: [SIZE, SIZE],
			// 		sunDirection: new Vector3(1, 1, 1).normalize().asArray(),
			// 	});
			//
			// 	gl.drawArrays(gl.TRIANGLES, 0, 6);
			//
			// 	requestAnimationFrame(render);
			// }
			const height = new Uint8Array(512 * 512 * 4).fill(0)

			for (let i = 0; i < 512 * 512; i++) {
				const height = (this.maps.height[i] + this.maps.waterColor[i * 4 + 3] + this.maps.waterFogColor[i * 4 + 3])
				height[i * 4] = Math.min(height, 255)
				height[i * 4 + 1] = height > 255 ? height - 255 : 0
			}

			const directLighting = new Renderer(this.$refs.render, this.$refs.view, 512, vs, fs, [
				{ name: 'tColor', src: this.maps.color },
				{ name: 'tHeight', src: height },
				{ name: 'tNormal', src: this.maps.normal },
				{ name: 'tWaterColor', src: this.maps.waterColor },
				{ name: 'tWaterFogColor', src: this.maps.waterFogColor },
			], {
				sunPosition: this.sun.raw,
				sunDirection: Vector3.fromArray(this.sun.vector ?? [1, 1, 1]).normalize().asArray(),
				highlightColor: fromHex(this.colors.highlight),
				shadowColor: fromHex(this.colors.shadow),
			})
			directLighting.render()
			this.directLighting = directLighting

// 			const softShadows = new Renderer(this.$refs.original, 512,
// `precision highp float;
// attribute vec2 position;
//
// void main() {
// 	gl_Position = vec4(position, 0, 1);
// }`,
// `precision highp float;
// uniform sampler2D tElevation;
// uniform sampler2D tNormal;
// uniform sampler2D tSrc;
// uniform vec3 sunDirection;
// uniform vec2 resolution;
// uniform float pixelScale;
// void main() {
// 	vec2 ires = 1.0 / resolution;
// 	vec3 src = texture2D(tSrc, gl_FragCoord.xy * ires).rgb;
// 	vec4 e0 = texture2D(tElevation, gl_FragCoord.xy * ires);
// 	vec3 n0 = texture2D(tNormal, gl_FragCoord.xy * ires).rgb;
// 	vec2 sr = normalize(sunDirection.xy);
// 	vec2 p0 = gl_FragCoord.xy;
// 	vec2 p = floor(p0);
// 	vec2 stp = sign(sr);
// 	vec2 tMax = step(0.0, sr) * (1.0 - fract(p0)) + (1.0 - step(0.0, sr)) * fract(p0);
// 	tMax /= abs(sr);
// 	vec2 tDelta = 1.0 / abs(sr);
// 	for (int i = 0; i < 65536; i++) {
// 		if (tMax.x < tMax.y) {
// 			tMax.x += tDelta.x;
// 			p.x += stp.x;
// 		} else {
// 			tMax.y += tDelta.y;
// 			p.y += stp.y;
// 		}
// 		vec2 ptex = ires * (p + 0.5);
// 		if (ptex.x < 0.0 || ptex.x > 1.0 || ptex.y < 0.0 || ptex.y > 1.0) {
// 			gl_FragColor = vec4(src + vec3(1.0/128.0) * clamp(dot(n0, sunDirection), 0.0, 1.0), 1.0);
// 			return;
// 		}
// 		vec4 e = texture2D(tElevation, ptex);
// 		float t = distance(p + 0.5, p0);
// 		float z = e0.r + t * pixelScale * sunDirection.z;
// 		if (e.r > z) {
// 			gl_FragColor = vec4(src, 1.0);
// 			return;
// 		}
// 	}
// 	gl_FragColor = vec4(src + vec3(1.0/128.0) * clamp(dot(n0, sunDirection), 0.0, 1.0), 1.0);
// }`,
// 				[
// 					{ name: 'tElevation', src: this.maps.height },
// 					{ name: 'tNormal', src: this.maps.normal },
// 				],
// 				{
// 					sunDirection: directLighting.prop('sunDirection'),
// 					tSrc: directLighting.prop('src'),
// 				},
// 			)
// 			softShadows.render()
//
// 			const shadowPP = softShadows.PingPong()
//
// 			let sun = Vector3.fromArray(this.sun ?? [1, 1, 1]).normalize().multiply(149600000000)
// 			const scale = 695508000 * 100
//
// 			for (let i = 0; i < 128; i++) {
// 				const r = Math.random() * 2.0 * Math.PI;
// 				const z = Math.random() * 2.0 - 1.0;
// 				const zScale = Math.sqrt(1.0 - z * z) * scale;
//
// 				sun = sun.add(new Vector3(Math.cos(r) * zScale, Math.sin(r) * zScale, z * scale)).normalize()
// 				softShadows.setProp('sunDirection', sun)
//
// 				softShadows.setProp('tSrc', shadowPP.ping())
// 				softShadows.setProp('dest', i === 127 ? undefined : shadowPP.pong())
// 				shadowPP.swap();
// 			}

			console.log('Finished', this.tile.path)
			console.timeEnd(this.tile.path)
			this.loading = false
		},
		updateProps() {
			if (this.directLighting) {
				this.directLighting.setProp('sunPosition', this.sun.raw)
				this.directLighting.setProp('sunDirection', Vector3.fromArray([parseFloat(this.sun.vector[0]), parseFloat(this.sun.vector[1]), parseFloat(this.sun.vector[2])] ?? [1, 1, 1]).normalize().asArray())

				this.directLighting.setProp('highlightColor', fromHex(this.colors.highlight))
				this.directLighting.setProp('shadowColor', fromHex(this.colors.shadow))

				this.directLighting.render()
			}
		},

		click(e) {
			const id = parseInt(e.target.dataset.id) - 1
			const loc = [
				e.offsetX + (id % 32) * 16 + this.tile.x * 512,
				e.offsetY + Math.floor(id / 32) * 16 + this.tile.z * 512,
			]
			console.log(loc)
		},
	},
}
</script>

<style scoped>
.tile {
	width: 512px;
	height: 512px;
	position: absolute;
	z-index: 1;
	background-color: #3F3F3F;
}
.tile.tile-loading {
	border: 1px solid #1A536E;
}
.tile .tile-interact {
	z-index: 3;
	position: absolute;
	width: 100%;
	height: 100%;
	pointer-events: none;
}
.tile .tile-overlay {
	z-index: 2;
	display: flex;
	flex-wrap: wrap;
	position: absolute;
}
.tile .tile-overlay .tile-chunk {
	width: 16px;
	height: 16px;
}
.tile .tile-overlay .tile-chunk:hover {
	background-color: rgba(255, 255, 255, .2);
}
.tile .tile-content {
	width: 512px;
	height: 512px;
	z-index: 1;
	-ms-interpolation-mode: nearest-neighbor;
	image-rendering: pixelated;
}
.tile .tile-content canvas {
	position: absolute;
	top: 0;
	left: 0;
}
</style>
