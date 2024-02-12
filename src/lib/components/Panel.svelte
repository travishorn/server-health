<script>
	export let title = '';
</script>

<div class="bg-white rounded shadow">
	<h2 class="font-medium border-b bg-gray-50 rounded-t px-4 py-2">{title}</h2>

	<div class="p-6">
		<slot />
	</div>
</div>
