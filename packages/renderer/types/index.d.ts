import type { Recents } from '#main/storage/Recents';
import type { FileFilter } from 'electron';
import type { RouteLocationNormalized } from 'vue-router';
import type Region from '#type/WorldViewer/Region';
import type { RecentFileExtended } from '../../main/types/RecentFile';
import type { ProgressItem, ProgressReturn } from '#main/models/Progress';
import type { Directory, File } from '#main/Helper';
import { Question, SaveFile } from '#main/electron/Dialogs';

export {}

declare global {
	interface Window {
		api: {
			info: {
				getMinecraftPath: { (): string }
				getAppVersion: { (): string }
			}

			onboarding: {
				getMinecraftResources: { (mcDir: string, dirIsJar = false): Promise<string> }
				buildData: { (): Promise<void> }
				setFinishedOnboarding: { (finishedOnboarding: boolean): Promise<void> }
			}

			files: {
				selectFile: { (buttonLabel?: string, filters: FileFilter[], defaultPath?: string): Promise<string | undefined> }
				openFolder: { (buttonLabel?: string, defaultPath?: string): Promise<string | undefined> }

				getImage: { (fileName: string): Promise<Buffer> }

				saveFile: { (data: never, encoding: BufferEncoding, buttonLabel?: string, filters: FileFilter[] = [], defaultName?: string, defaultPath?: string): Promise<string | undefined> }
			}

			config: {
				getRecents: { (section: Recents): Promise<RecentFileExtended[]>}
				addToRecents: { (section: Recents, file: string, name: string): Promise<void>}
			}

			mc: {
				getNBT: { (filePath: string): Promise<never> }

				getAssets: { (version: string, dir?: string[] | string): Promise<(File | Directory)[]> }
				getAsset: { (version: string, file: string, includeMCMeta = false): Promise<{ path: string, relativePath: string, mime: string, data: never, mcmeta?: object }> }
			}

			worldViewer: {
				getRegions: { (filePath: string): Region[] }
				getMap: { (uuid: string, filePath: string) }
				createMap: { (uuid: string, levelPath: string, filePath: string) }
				calcMaps: { (fileName: string): Promise<{ img: Buffer, height: Buffer, normal: Buffer }> }
			},

			progress: {
				createSimple: { (key: string, status: string, total: number): void }
				createAdvanced: { (key: string, status: string): void }
				count: { (key: string, index?: number): ProgressReturn }
				setStatus: { (key: string, status: string, index?: number): ProgressReturn }
				setTotal: { (key: string, total: number, index?: number): ProgressReturn }
				addItems: { (key: string, items: ProgressItem[]): ProgressReturn }
			}

			setActivePage: { (to: RouteLocationNormalized): void }

			dialog: { (dialog: Question | SaveFile) }

			setSaved: { (saved = false): void }
			isSaved: { (): boolean }
			setProgressBar: function
		},
		callback: {
			progressUpdate: { (callback: (event: never, progress: ProgressReturn) => void): void }
		}
		vars: {
			IS_DEV: boolean
			BASE_URL: string
		},

		getUUID: { (): string}
		joinPaths: { (...paths: string[]): string}
	}
}
