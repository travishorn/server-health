<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1 class="text-3xl font-bold underline">Server Health</h1>

<div>
	{JSON.stringify(data)}
</div>
