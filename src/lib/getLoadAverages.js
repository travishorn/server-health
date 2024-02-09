import serverCommand from './serverCommand.js';

export default async function () {
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
		: { '1min': undefined, '5min': undefined, '15min': undefined };
}
