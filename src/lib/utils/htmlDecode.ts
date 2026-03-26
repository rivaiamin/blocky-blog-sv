/**
 * Decodes HTML entities in plain text (e.g. paragraph content stored as `&amp;`).
 * Uses the DOM in the browser; iterates named/numeric entities on the server.
 */
export function htmlDecode(str: string): string {
	if (!str) return str;

	if (typeof document !== 'undefined') {
		const el = document.createElement('textarea');
		el.innerHTML = str;
		return el.value;
	}

	const named: Record<string, string> = {
		nbsp: '\u00A0',
		amp: '&',
		lt: '<',
		gt: '>',
		quot: '"',
		apos: "'"
	};

	let prev: string;
	let out = str;
	do {
		prev = out;
		out = out
			.replace(/&#x([0-9a-fA-F]+);/gi, (_, hex) =>
				String.fromCodePoint(parseInt(hex, 16))
			)
			.replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
			.replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (full, name: string) => {
				const decoded = named[name.toLowerCase()];
				return decoded !== undefined ? decoded : full;
			});
	} while (out !== prev);

	return out;
}
