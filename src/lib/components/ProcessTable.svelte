<script>
	/** @type {Array<{ name: string, usage: number } | null>} */
	export let processes = [];
</script>

<table class="table-auto text-xs text-gray-600">
	<tbody>
		{#each processes as process, i}
			{#if process}
				<tr class={i % 2 === 0 ? 'bg-gray-100' : ''}>
					<td class="px-2 py-1">{process.name}</td>
					<td class="px-2 py-1 text-right text-black">{process.usage.toFixed(1)}%</td>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>
