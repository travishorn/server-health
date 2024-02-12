<script>
	import prettyBytes from 'pretty-bytes';

	/** @type {Array<{ name: string, size: number } | null>} */
	export let files = [];

	const enhancedFiles = files.map((file) => {
		const abbreviatedName =
			file && file.name.length > 28
				? file?.name.slice(0, 12) + '...' + file?.name.slice(-12)
				: file?.name;
		return {
			...file,
			abbreviatedName
		};
	});
</script>

<table class="table-auto text-xs text-gray-600">
	<tbody>
		{#each enhancedFiles as file, i}
			{#if file}
				<tr class={i % 2 === 0 ? 'bg-gray-100' : ''}>
					<td class="px-2 py-1" title={file.name}>{file.abbreviatedName}</td>
					<td class="px-2 py-1 text-right text-black"
						>{prettyBytes(file.size ?? 0, {
							minimumFractionDigits: 1,
							maximumFractionDigits: 1
						})}</td
					>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>
