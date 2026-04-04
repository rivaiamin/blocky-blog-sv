<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="mx-auto max-w-md">
	<h1 class="mb-2 text-2xl font-bold text-slate-900">Choose your username</h1>
	<p class="mb-6 text-sm text-slate-600">
		This becomes your public URL: <code class="rounded bg-slate-100 px-1">/your-name</code>. Use
		lowercase letters, numbers, and hyphens only.
	</p>

	<form method="POST" use:enhance class="space-y-4">
		<label class="block">
			<span class="text-sm text-slate-700">Username</span>
			<input
				type="text"
				name="username"
				required
				autocomplete="username"
				class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 shadow-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
			/>
		</label>
		{#if form?.message}
			<p class="text-sm text-red-600" role="alert">{form.message}</p>
		{/if}
		<button
			type="submit"
			class="w-full rounded-xl bg-[var(--color-primary)] px-4 py-2.5 font-medium text-white hover:opacity-95"
			>Continue</button
		>
	</form>
</div>
