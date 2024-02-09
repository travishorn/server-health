import serverCommand from './serverCommand.js';
import parseJournalDuration from './parseJournalDuration.js';
import parseJournalTimestamp from './parseJournalTimestamp.js';

export default async function () {
	// Get the journalctl output for the ETL job
	const stdout = await serverCommand('sudo -S journalctl -n 4 -u sis_etl.service');
	const lines = stdout.split('\n');
	let finished;
	let succeeded = false;
	let cpuTimeConsumed;
	let realTimeConsumed;

	for (const line of lines) {
		// Look for specific patterns in the string to pull out relevant info
		const timestampMatch = line.match(/^(\w{3} \d{2} \d{2}:\d{2}:\d{2})/);
		const cpuTimeMatch = line.match(/Consumed (.+?) CPU time\./);
		const realTimeMatch = line.match(/All jobs complete. \((.+?)\)/);

		if (timestampMatch) finished = parseJournalTimestamp(timestampMatch[1]);
		if (cpuTimeMatch) cpuTimeConsumed = parseJournalDuration(cpuTimeMatch[1]);
		if (realTimeMatch) realTimeConsumed = parseJournalDuration(realTimeMatch[1]);
		if (line.includes('Succeeded.')) succeeded = true;
	}

	return {
		finished,
		succeeded,
		cpuTimeConsumed,
		realTimeConsumed
	};
}
