import serverCommand from './serverCommand.js';

export default async function () {
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
