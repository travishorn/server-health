import serverCommand from './serverCommand.js';

async function getTotals() {
	const stdout = await serverCommand('df -B1');
	const lines = stdout.split('\n');
	let used;
	let total;

	for (const line of lines) {
		if (line.includes('/dev/mapper/data--vg-root')) {
			const match = line.match(/\d+/g);
			if (match) {
				used = Number(match[1]);
				total = Number(match[1]) + Number(match[2]);
			}
		}
	}

	return {
		used,
		total
	};
}

async function getFiles() {
	const stdout = await serverCommand(
		'sudo -S find / -type d -name proc -prune -o -type f -exec du -b {} + | sort -rh | head -n 5'
	);
	return stdout
		.split('\n')
		.slice(0, 5)
		.map((line) => {
			const parts = line.split('\t');

			return {
				name: parts[1],
				size: Number(parts[0])
			};
		});
}

export default async function () {
	return {
		...(await getTotals()),
		files: await getFiles()
	};
}
