import serverCommand from './serverCommand.js';

export default async function () {
	return new Date(await serverCommand('uptime -s'));
}
