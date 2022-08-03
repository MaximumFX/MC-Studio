interface Window {
	width: number
	height: number
	x: number | undefined
	y: number | undefined
}

interface SettingsType {
	finishedOnboarding: boolean
	minecraftPath: string
	window: Window
}

export default class Settings {
	finishedOnboarding = false
	minecraftPath?: string
	window: Window

	constructor(data?: SettingsType) {
		this.finishedOnboarding = data?.finishedOnboarding ?? false
		this.minecraftPath = data?.minecraftPath

		this.window = data?.window ?? {
			width: 1000,
			height: 630,
			x: undefined,
			y: undefined,
		}
	}

	static fromJSON(data: SettingsType): Settings {
		return new Settings(data)
	}
}
