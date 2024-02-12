import serverCommand from './serverCommand.js';

export default async function () {
	const stdout = await serverCommand('ps aux --sort=-%cpu | head -n 6 | tail -n 5');
	const lines = stdout.split('\n');

	return lines
		.map((line) => {
			const parts = line.match(/\S+/g);

			if (parts) {
				return {
					name: parts[10],
					cpu: Number(parts[2]),
					memory: Number(parts[3])
				};
			} else {
				return null;
			}
		})
		.filter((process) => process);
}
