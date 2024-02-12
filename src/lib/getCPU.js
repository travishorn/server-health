import serverCommand from './serverCommand.js';

async function getProcesses() {
	const stdout = await serverCommand('ps aux --sort=-%cpu | head -n 6 | tail -n 5');
	const lines = stdout.split('\n');

	return lines
		.map((line) => {
			const parts = line.match(/\S+/g);

			if (parts) {
				return {
					name: parts[10],
					usage: Number(parts[2])
				};
			} else {
				return null;
			}
		})
		.filter((process) => process);
}

async function getLoadAverages() {
	const stdout = await serverCommand('uptime');

	const uptimeRegex =
		/up\s+(.*?),\s+([\s\S]+?)\s+user.*load average:\s+([\d.]+),\s+([\d.]+),\s+([\d.]+)/;
	const matches = stdout.match(uptimeRegex);

	return matches
		? {
				'1min': parseFloat(matches[3]),
				'5min': parseFloat(matches[4]),
				'15min': parseFloat(matches[5])
			}
		: { '1min': 0, '5min': 0, '15min': 0 };
}

export default async function () {
	return {
		loadAverages: await getLoadAverages(),
		processes: await getProcesses()
	};
}
