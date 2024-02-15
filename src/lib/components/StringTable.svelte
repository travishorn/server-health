<script>
	/** @type {Array<string|undefined>} */
	export let items = [];
</script>

<table class="table-auto text-xs text-gray-600">
	<tbody>
		{#each items as item, i}
			{#if item}
				<tr class={i % 2 === 0 ? 'bg-gray-100' : ''}>
					<td class="px-2 py-1">{item}</td>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>
