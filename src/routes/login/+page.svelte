<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="mx-auto max-w-md">
	<h1 class="theme-text-primary mb-6 text-2xl font-bold">Sign in</h1>
	<form method="POST" action="?/signInEmail" use:enhance class="space-y-4">
		<label class="block">
			<span class="text-sm text-slate-700">Email</span>
			<input
				type="email"
				name="email"
				required
				class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 shadow-sm outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
			/>
		</label>
		<label class="block">
			<span class="text-sm text-slate-700">Password</span>
			<input
				type="password"
				name="password"
				required
				class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 shadow-sm outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
			/>
		</label>
		<button
			type="submit"
			class="theme-btn theme-bg-primary w-full rounded-xl px-4 py-2.5 font-medium text-white"
			>Sign in</button
		>
		<button
			type="submit"
			formaction="?/signUpEmail"
			class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-800 hover:bg-slate-50"
			>Create account</button
		>
		<label class="block">
			<span class="text-sm text-slate-700">Name (for registration)</span>
			<input
				type="text"
				name="name"
				class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 shadow-sm outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
			/>
		</label>
		<label class="block">
			<span class="text-sm text-slate-700">Username (optional, for your public URL)</span>
			<input
				type="text"
				name="username"
				autocomplete="username"
				placeholder="e.g. jamie-writes"
				class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 shadow-sm outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/30"
			/>
		</label>
	</form>
	{#if form?.message}
		<p class="mt-4 text-sm text-red-600">{form.message}</p>
	{/if}
</div>
