import serverCommand from './serverCommand.js';

export default async function () {
	const stdout = await serverCommand('free');
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
