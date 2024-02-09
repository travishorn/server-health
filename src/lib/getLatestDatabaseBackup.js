import serverCommand from './serverCommand.js';
import parseJournalDuration from './parseJournalDuration.js';
import parseJournalTimestamp from './parseJournalTimestamp.js';

export default async function () {
	// Get the journalctl output for the db backup job
	const stdout = await serverCommand('sudo -S journalctl -n 2 -u backup_databases.service');
	const lines = stdout.split('\n');
	let timestamp;
	let succeeded = false;
	let cpuTimeConsumed;

	for (const line of lines) {
		// Look for specific patterns in the string to pull out relevant info
		const timestampMatch = line.match(/^(\w{3} \d{2} \d{2}:\d{2}:\d{2})/);
		const cpuTimeMatch = line.match(/Consumed (.+?) CPU time\./);

		if (timestampMatch) timestamp = parseJournalTimestamp(timestampMatch[1]);
		if (cpuTimeMatch) cpuTimeConsumed = parseJournalDuration(cpuTimeMatch[1]);
		if (line.includes('Succeeded.')) succeeded = true;
	}

	return {
		timestamp,
		succeeded,
		cpuTimeConsumed
	};
}
