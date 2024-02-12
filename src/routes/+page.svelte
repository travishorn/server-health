<script>
	import prettyBytes from 'pretty-bytes';
	import { DateTime, Duration } from 'luxon';
	import Panel from '$lib/components/Panel.svelte';
	import ProcessTable from '$lib/components/ProcessTable.svelte';
	import FileTable from '$lib/components/FileTable.svelte';
	import StringTable from '$lib/components/StringTable.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const uptime = DateTime.now().diff(DateTime.fromJSDate(data.systemUpSince), [
		'years',
		'months',
		'days',
		'hours',
		'minutes'
	]);

	const dbBackupDuration = Duration.fromMillis(data.databaseBackups.latest.cpuTimeConsumed ?? 0, {
		numberingSystem: 'latn'
	})
		.shiftTo('minutes')
		.get('minutes')
		.toFixed(1);

	const etlDuration = Duration.fromMillis(data.latestETLJob.cpuTimeConsumed ?? 0, {
		numberingSystem: 'latn'
	})
		.shiftTo('minutes')
		.get('minutes')
		.toFixed(1);

	const etlClockDuration = Duration.fromMillis(data.latestETLJob.realTimeConsumed ?? 0, {
		numberingSystem: 'latn'
	})
		.shiftTo('minutes')
		.get('minutes')
		.toFixed(1);
</script>

<div class="bg-gray-200 min-h-screen p-10">
	<div class="container justify-center mx-auto flex flex-wrap gap-6">
		<Panel title="CPU">
			<div class="flex flex-col gap-6">
				<div class="flex gap-8 justify-center">
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

				<FileTable files={data.storage.files} />
			</div>
		</Panel>

		<Panel title="Uptime">
			<div class="flex flex-col gap-6">
				<div class="flex gap-8 justify-center">
					{#each Object.keys(uptime.toObject()) as part}
						{#if uptime.get(part) > 0}
							<div>
								<div class="text-2xl text-center">{Math.floor(uptime.get(part))}</div>
								<div class="text-gray-400 text-sm text-center">{part}</div>
							</div>
						{/if}
					{/each}
				</div>

				<div>
					<div class="text-2xl text-center">
						{data.reboot.monthlyReboot.checkedOn?.toLocaleDateString()}
					</div>
					<div class="text-gray-400 text-sm text-center">last reboot checkpoint</div>
				</div>

				{#if data.reboot.rebootRequiredNow}
					<div class="flex items-center gap-2 justify-center text-sm">
						<div class="h-2 w-2 bg-amber-400 rounded-full"></div>
						reboot pending
					</div>
				{/if}
			</div>
		</Panel>

		<Panel title="Database Backup">
			<div class="flex flex-col gap-6">
				<div class="flex gap-8 justify-between">
					<div>
						<div class="text-2xl text-center">
							{data.databaseBackups.latest.finished?.toLocaleDateString()}
						</div>
						<div class="text-gray-400 text-sm text-center">latest backup</div>
					</div>

					<div>
						<div class="text-2xl text-center">{dbBackupDuration}</div>
						<div class="text-gray-400 text-sm text-center">CPU mins</div>
					</div>
				</div>

				{#if !data.databaseBackups.latest.succeeded}
					<div class="flex items-center gap-2 justify-center text-sm text-red-600">
						<div class="h-2 w-2 bg-red-600 rounded-full"></div>
						BACKUP FAILED
					</div>
				{/if}

				<StringTable items={data.databaseBackups.dates.map((d) => d?.toLocaleDateString())} />
			</div>
		</Panel>

		<Panel title="ETL">
			<div class="flex flex-col gap-6">
				<div class="flex gap-8 justify-between">
					<div>
						<div class="text-2xl text-center">
							{data.latestETLJob.finished?.toLocaleDateString()}
							{data.latestETLJob.finished?.toLocaleTimeString()}
						</div>
						<div class="text-gray-400 text-sm text-center">latest job completed</div>
					</div>
				</div>

				{#if !data.latestETLJob.succeeded}
					<div class="flex items-center gap-2 justify-center text-sm text-red-600">
						<div class="h-2 w-2 bg-red-600 rounded-full"></div>
						JOB FAILED
					</div>
				{/if}

				<div class="flex gap-8 justify-center">
					<div>
						<div class="text-2xl text-center">{etlDuration}</div>
						<div class="text-gray-400 text-sm text-center">CPU mins</div>
					</div>

					<div>
						<div class="text-2xl text-center">{etlClockDuration}</div>
						<div class="text-gray-400 text-sm text-center">clock mins</div>
					</div>
				</div>
			</div>
		</Panel>

		<Panel title="Upgrades"></Panel>
	</div>
</div>

<div>
	{JSON.stringify(data)}
</div>
