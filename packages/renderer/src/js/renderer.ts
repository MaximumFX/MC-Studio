import * as twgl from 'twgl.js';

export default class Renderer {
	gl: WebGL2RenderingContext
	view: CanvasRenderingContext2D | null

	size: number
	textures: {
		name: string,
		src: number[]
		twglTex: WebGLTexture
	}[] = []
	props: { [key: string]: unknown }

	tilesAcross = 8
	tilesDown = 4
	m4 = twgl.m4
	programInfo
	bufferInfo

	constructor(canvas: HTMLCanvasElement, viewCanvas: HTMLCanvasElement, size: number, vs: string, fs: string, textures: [{name: string, src: number[], bits?: boolean}], props: { [key: string]: unknown }) {
		const gl = canvas.getContext('webgl2')
		if (!gl) throw 'no_webgl'


		this.view = viewCanvas.getContext('2d')

		this.gl = gl
		this.size = size
		this.props = props

		twgl.addExtensionsToContext(this.gl)

		// const ext = this.gl.getExtension('EXT_color_buffer_float')
		// if (!ext) {
		// 	throw 'requires EXT_color_buffer_float'
		// }

		textures.forEach(t => {
			this.textures.push({
				...t,
				twglTex: twgl.createTexture(this.gl, {
					src: t.src,
					width: size,
					height: size,
					flipY: 1,
					// internalFormat: t.bits ? gl.RED_BITS : gl.RGBA,
					// format: t.bits ? gl.RED : gl.RGBA,
					// type: t.bits ? gl.UNSIGNED_INT : gl.UNSIGNED_BYTE,
					wrap: gl.CLAMP_TO_EDGE,
					min: gl.LINEAR,
				}),
			})
		})


		// compile shaders, link, look up locations
		this.programInfo = twgl.createProgramInfo(this.gl, [vs, fs]);
		// gl.createBuffer, bindBuffer, bufferData
		this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, {
			position: {
				numComponents: 2,
				data: [
					-1, -1, 1, -1, 1, 1,
					-1, -1, 1, 1, -1, 1],
			},
		});
	}

	run = () => {
		requestAnimationFrame(this.anim)
	}

	anim = () => {
		this.render()

		requestAnimationFrame(this.anim);
	}

	render = () => {
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clearColor(1, 1, 1, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.gl.useProgram(this.programInfo.program);
		twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
		// twgl.bindFramebufferInfo(this.gl, twgl.createFramebufferInfo(this.gl, [{
		// 	internalFormat: this.gl.RGBA32F,
		// 	type: this.gl.FLOAT,
		// 	minMag: this.gl.NEAREST,
		// 	wrap: this.gl.CLAMP_TO_EDGE,
		// }], this.size, this.size))

		const mat = this.m4.ortho(0, this.gl.canvas.width, this.gl.canvas.height, 0, -1, 1);
		this.m4.scale(mat, [this.gl.canvas.width, this.gl.canvas.height, 1], mat);


		const tmat = this.m4.identity();

		const values: any = {
			...this.props,
			u_matrix: mat,
			u_texMatrix: tmat,
			u_tilesetSize: [this.tilesAcross, this.tilesDown],
			elevationScale: 1,
			pixelScale: 1,
			resolution: [this.size, this.size],
		}
		this.textures.forEach(t => values[t.name] = t.twglTex)

		twgl.setUniforms(this.programInfo, values);

		this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

		if (this.view) this.view.drawImage(this.gl.canvas, 0, 0)
	}

	prop = (key: string) => {
		if (key === 'src') {
			return twgl.createTexture(this.gl, {
				src: this.gl.canvas,
				width: this.size,
				height: this.size,
			})
		}
		if (this.textures.some(t => t.name === key))
			return this.textures.find(t => t.name === key)
		else this.props[key]
	}

	setProp = (key: string, value: any) => this.props[key] = value

	PingPong() {
		const fbos = [this.gl.createFramebuffer(), this.gl.createFramebuffer()];

		let index = 0;

		function ping() {
			return fbos[index];
		}

		function pong() {
			return fbos[1 - index];
		}

		function swap() {
			index = 1 - index;
		}

		return {
			ping,
			pong,
			swap,
		}
	}
}
