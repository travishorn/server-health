import serverCommand from './serverCommand.js';

export default async function getSystemUpSince() {
	return new Date(await serverCommand('uptime -s'));
}
