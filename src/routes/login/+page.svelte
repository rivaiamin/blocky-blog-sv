<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { authClient } from '$lib/auth-client';

	let { form }: { form: ActionData } = $props();

	async function signInGoogle() {
		const result = await authClient.signIn.social({
			provider: 'google',
			callbackURL: '/dashboard',
			errorCallbackURL: '/login',
			newUserCallbackURL: '/setup-username'
		});

		const url = result?.data?.url;
		if (url) window.location.href = url;
	}
</script>

<div class="mx-auto w-full max-w-md">
	<div class="relative">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -inset-x-10 -top-10 -z-10 h-56 rounded-full bg-[radial-gradient(circle_at_30%_30%,color-mix(in_oklab,var(--color-primary)_22%,transparent),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.16),transparent_58%)] blur-2xl"
		></div>

		<div class="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.55)] backdrop-blur-md sm:p-8">
			<div class="mb-7">
				<p
					class="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold tracking-wide text-white"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
					Pilakon account
				</p>
				<h1 class="theme-text-primary mt-4 text-3xl font-semibold tracking-tight">Welcome back</h1>
				<p class="mt-2 text-sm leading-relaxed text-slate-600">
					Sign in to continue. New here? Create an account in under a minute.
				</p>
			</div>

			<button
				type="button"
				onclick={signInGoogle}
					class="group inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--color-primary)/20"
			>
				<span class="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition group-hover:ring-slate-300">
					<img src="/google-logo.svg" alt="Google" class="h-4 w-4" />
				</span>
				Continue with Google
			</button>

			<div class="my-6 flex items-center gap-3">
					<div class="h-px flex-1 bg-slate-200/90"></div>
				<span class="text-xs font-medium text-slate-500">or use email</span>
					<div class="h-px flex-1 bg-slate-200/90"></div>
			</div>

			<form method="POST" action="?/signInEmail" use:enhance class="space-y-4">
				<label class="block">
					<span class="text-sm font-medium text-slate-700">Email</span>
					<input
						type="email"
						name="email"
						autocomplete="email"
						required
						class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/15"
						placeholder="you@example.com"
					/>
				</label>
				<label class="block">
					<span class="text-sm font-medium text-slate-700">Password</span>
					<input
						type="password"
						name="password"
						autocomplete="current-password"
						required
						class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/15"
						placeholder="••••••••"
					/>
				</label>

				<button
					type="submit"
					class="theme-btn theme-bg-primary w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--color-primary)/25"
				>
					Sign in
				</button>

				<details class="group rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
					<summary
						class="cursor-pointer list-none select-none text-sm font-semibold text-slate-900 outline-none"
					>
						<div class="flex items-center justify-between gap-4">
							<span>Create an account</span>
							<span
								class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition group-open:text-slate-900 group-open:ring-slate-300"
							>
								Free
							</span>
						</div>
						<p class="mt-1 text-xs font-medium text-slate-600">
							Add a name (and optionally a username for your public URL).
						</p>
					</summary>

					<div class="mt-4 space-y-4">
						<label class="block">
							<span class="text-sm font-medium text-slate-700">Name</span>
							<input
								type="text"
								name="name"
								autocomplete="name"
								class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/15"
								placeholder="Jamie Appleseed"
							/>
						</label>
						<label class="block">
							<span class="text-sm font-medium text-slate-700">Username (optional)</span>
							<input
								type="text"
								name="username"
								autocomplete="username"
								placeholder="e.g. jamie-writes"
								class="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-(--color-primary) focus:ring-4 focus:ring-(--color-primary)/15"
							/>
							<p class="mt-1 text-xs text-slate-600">This becomes your public URL: <span class="font-semibold">/username</span></p>
						</label>
						<button
							type="submit"
							formaction="?/signUpEmail"
							class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--color-primary)/20"
						>
							Create account
						</button>
					</div>
				</details>
			</form>

			{#if form?.message}
				<p class="mt-5 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
					{form.message}
				</p>
			{/if}
		</div>
	</div>
</div>
