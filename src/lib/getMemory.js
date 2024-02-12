import serverCommand from './serverCommand.js';

async function getProcesses() {
	const stdout = await serverCommand('ps aux --sort=-%mem | head -n 6 | tail -n 5');
	const lines = stdout.split('\n');

	return lines
		.map((line) => {
			const parts = line.match(/\S+/g);

			if (parts) {
				return {
					name: parts[10],
					usage: Number(parts[3])
				};
			} else {
				return null;
			}
		})
		.filter((process) => process);
}

async function getUsage() {
	const stdout = await serverCommand('free -b');
	const lines = stdout.split('\n');
	let used;
	let total;

	for (const line of lines) {
		if (line.includes('Mem:')) {
			const match = line.match(/\d+/g);
			if (match) {
				used = Number(match[1]);
				total = Number(match[0]);
			}
		}
	}

	return {
		used,
		total
	};
}

export default async function () {
	return {
		...(await getUsage()),
		processes: await getProcesses()
	};
}
