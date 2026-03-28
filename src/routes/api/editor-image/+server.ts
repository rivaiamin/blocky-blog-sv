import { json, error, type RequestHandler } from '@sveltejs/kit';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { optimizeEditorImage } from '$lib/server/editor-image-optimize';

const UPLOAD_SUBDIR = join('static', 'uploads', 'editor');

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		error(401, 'Unauthorized');
	}

	const fd = await request.formData();
	const entry = fd.get('image');
	if (!(entry instanceof File) || entry.size === 0) {
		error(400, 'Missing image file');
	}

	const raw = Buffer.from(await entry.arrayBuffer());

	const result = await optimizeEditorImage(raw);
	if (!result.ok) {
		if (result.reason === 'too_large') {
			error(413, 'Image too large');
		}
		error(400, 'Invalid or unsupported image');
	}

	const name = `${randomUUID()}.${result.ext}`;
	const dir = join(process.cwd(), UPLOAD_SUBDIR);
	await mkdir(dir, { recursive: true });
	const diskPath = join(dir, name);
	await writeFile(diskPath, result.data);

	const url = `/uploads/editor/${name}`;
	return json({
		success: 1,
		file: { url }
	});
};
