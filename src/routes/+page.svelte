<script>
	import prettyBytes from 'pretty-bytes';
	import Panel from '$lib/components/Panel.svelte';
	import ProcessTable from '$lib/components/ProcessTable.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="bg-gray-200 min-h-screen p-10">
	<div class="max-w-3xl mx-auto grid grid-flow-col auto-cols-max gap-6">
		<Panel title="CPU">
			<div class="flex flex-col gap-6">
				<div class="flex gap-8">
					<div>
						<div class="text-2xl text-center">{data.cpu.loadAverages['1min'] * 100}%</div>
						<div class="text-gray-400 text-sm text-center">1m</div>
					</div>

					<div>
						<div class="text-2xl text-center">{data.cpu.loadAverages['5min'] * 100}%</div>
						<div class="text-gray-400 text-sm text-center">5m</div>
					</div>

					<div>
						<div class="text-2xl text-center">{data.cpu.loadAverages['15min'] * 100}%</div>
						<div class="text-gray-400 text-sm text-center">15m</div>
					</div>
				</div>

				<ProcessTable processes={data.cpu.processes} />
			</div>
		</Panel>

		<Panel title="Memory">
			<div class="flex flex-col gap-6">
				{#if data.memory.total && data.memory.total > 0}
					<div>
						<div class="text-2xl text-center">
							{(((data.memory.used ?? 0) / data.memory.total) * 100).toFixed(1)}%
						</div>
						<div class="text-gray-400 text-sm text-center">
							{prettyBytes(data.memory.used ?? 0)} / {prettyBytes(data.memory.total)}
						</div>
					</div>
				{/if}

				<ProcessTable processes={data.memory.processes} />
			</div>
		</Panel>

		<Panel title="Storage">
			<div class="flex flex-col gap-6">
				{#if data.storage.total && data.storage.total > 0}
					<div>
						<div class="text-2xl text-center">
							{(((data.storage.used ?? 0) / data.storage.total) * 100).toFixed(1)}%
						</div>
						<div class="text-gray-400 text-sm text-center">
							{prettyBytes(data.storage.used ?? 0)} / {prettyBytes(data.storage.total)}
						</div>
					</div>
				{/if}
			</div>
		</Panel>
	</div>
</div>

<div>
	{JSON.stringify(data)}
</div>
