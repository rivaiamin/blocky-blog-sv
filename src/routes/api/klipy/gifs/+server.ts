import { error, json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const KLIPY_BASE = 'https://api.klipy.com';

type KlipyFormat = { url?: string };
type KlipyTier = {
	gif?: KlipyFormat;
	jpg?: KlipyFormat;
	webp?: KlipyFormat;
};

type KlipyGifItem = {
	id?: number;
	title?: string;
	file?: { md?: KlipyTier; hd?: KlipyTier; sm?: KlipyTier };
};

function pickGifUrl(item: KlipyGifItem): string | undefined {
	const tiers = [item.file?.md, item.file?.hd, item.file?.sm];
	for (const t of tiers) {
		const u = t?.gif?.url;
		if (u) return u;
	}
	return undefined;
}

function pickPreviewUrl(item: KlipyGifItem): string | undefined {
	const tiers = [item.file?.md, item.file?.sm, item.file?.hd];
	for (const t of tiers) {
		const jpg = t?.jpg?.url;
		if (jpg) return jpg;
		const webp = t?.webp?.url;
		if (webp) return webp;
	}
	return pickGifUrl(item);
}

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) {
		error(401, 'Unauthorized');
	}

	const apiKey = env.KLIPY_API_KEY?.trim();
	if (!apiKey) {
		error(503, 'Klipy API key is not configured');
	}

	const q = url.searchParams.get('q')?.trim() ?? '';
	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	const perRaw = Number(url.searchParams.get('per_page'));
	const perPage = Number.isFinite(perRaw) ? Math.min(50, Math.max(8, perRaw)) : 24;

	const customerId = locals.user.id;

	const klipyUrl = new URL(`${KLIPY_BASE}/api/v1/${encodeURIComponent(apiKey)}/gifs/search`);
	klipyUrl.searchParams.set('customer_id', customerId);
	klipyUrl.searchParams.set('page', String(page));
	klipyUrl.searchParams.set('per_page', String(perPage));
	if (q) klipyUrl.searchParams.set('q', q);
	klipyUrl.searchParams.set('content_filter', 'medium');

	const res = await fetch(klipyUrl.toString(), {
		headers: { Accept: 'application/json' }
	});

	if (!res.ok) {
		const body = await res.text().catch(() => '');
		console.error('[klipy] search failed', res.status, body.slice(0, 500));
		error(502, 'Klipy request failed');
	}

	const payload = (await res.json()) as {
		result?: boolean;
		data?: { data?: KlipyGifItem[]; current_page?: number; per_page?: number; has_next?: boolean };
	};

	const rawItems = payload.data?.data ?? [];
	const items = rawItems
		.map((item) => ({
			id: item.id,
			title: String(item.title ?? ''),
			gifUrl: pickGifUrl(item) ?? '',
			previewUrl: pickPreviewUrl(item) ?? ''
		}))
		.filter((x) => x.gifUrl);

	return json({
		items,
		current_page: payload.data?.current_page ?? page,
		per_page: payload.data?.per_page ?? perPage,
		has_next: Boolean(payload.data?.has_next)
	});
};
