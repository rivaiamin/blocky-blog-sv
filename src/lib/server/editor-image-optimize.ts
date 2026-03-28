import sharp from 'sharp';

/** Max upload size before optimization (bytes). */
const MAX_INPUT_BYTES = 12 * 1024 * 1024;

/** Long edge cap; smaller images are not enlarged. */
const MAX_WIDTH = 1920;

const WEBP_QUALITY = 82;

export type OptimizeResult =
	| { ok: true; data: Buffer; ext: string; contentType: string }
	| { ok: false; reason: 'too_large' | 'invalid' | 'process_failed' };

/**
 * Resize (if needed), auto-orient, and compress to WebP.
 * Animated GIFs are stored as-is so frames are preserved.
 */
export async function optimizeEditorImage(input: Buffer): Promise<OptimizeResult> {
	if (input.length > MAX_INPUT_BYTES) {
		return { ok: false, reason: 'too_large' };
	}

	let meta: sharp.Metadata;
	try {
		meta = await sharp(input, { failOn: 'truncated' }).metadata();
	} catch {
		return { ok: false, reason: 'invalid' };
	}

	if (!meta.format) {
		return { ok: false, reason: 'invalid' };
	}

	const pages = meta.pages ?? 1;

	if (meta.format === 'gif' && pages > 1) {
		return {
			ok: true,
			data: input,
			ext: 'gif',
			contentType: 'image/gif'
		};
	}

	try {
		const data = await sharp(input)
			.rotate()
			.resize(MAX_WIDTH, null, {
				withoutEnlargement: true,
				fit: 'inside'
			})
			.webp({ quality: WEBP_QUALITY, effort: 4 })
			.toBuffer();

		return {
			ok: true,
			data,
			ext: 'webp',
			contentType: 'image/webp'
		};
	} catch {
		return { ok: false, reason: 'process_failed' };
	}
}
