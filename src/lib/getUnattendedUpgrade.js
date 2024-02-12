import serverCommand from './serverCommand.js';
import parseJournalDuration from './parseJournalDuration.js';
import parseJournalTimestamp from './parseJournalTimestamp.js';

/**
 * @param {string} logString - A string containing the log line indicating which packages will be upgraded in an unattended upgrade job
 * @returns {string[]} - The packages that will be upgraded
 */
function parsePackagesToUpgrade(logString) {
	const regex = /Packages that will be upgraded: (.+)$/m;
	const match = logString.match(regex);

	if (match && match[1]) {
		return match[1].split(' ');
	} else {
		return [];
	}
}

async function getPackagesUpgraded() {
	// Get the journalctl output for the details of the unattended upgrade job
	const stdout = await serverCommand(
		'sudo -S tail -n 20 /var/log/unattended-upgrades/unattended-upgrades.log'
	);
	const lines = stdout.split('\n');
	let succeeded = false;
	/** @type {string[]} */
	let packagesToUpgrade = [];

	// Rather than saying which packages were upgraded, there is a log line
	// listing which packages *will* be installed and a separate line later
	// indicating they *were* installed.
	for (const line of lines) {
		if (line.includes('Packages that will be upgraded')) {
			packagesToUpgrade = parsePackagesToUpgrade(line);
		}

		if (line.includes('All upgrades installed')) succeeded = true;
	}

	return succeeded ? packagesToUpgrade : [];
}

export default async function () {
	// Get the journalctl output for the unattended upgrade job
	const stdout = await serverCommand('sudo -S journalctl -n 3 -u apt-daily-upgrade.service');
	const lines = stdout.split('\n');
	let finished;
	let succeeded = false;
	let cpuTimeConsumed;

	for (const line of lines) {
		// Look for specific patterns in the string to pull out relevant info
		const timestampMatch = line.match(/^(\w{3} \d{2} \d{2}:\d{2}:\d{2})/);
		const cpuTimeMatch = line.match(/Consumed (.+?) CPU time\./);

		if (timestampMatch) finished = parseJournalTimestamp(timestampMatch[1]);
		if (cpuTimeMatch) cpuTimeConsumed = parseJournalDuration(cpuTimeMatch[1]);
		if (line.includes('Succeeded.')) succeeded = true;
	}

	return {
		finished,
		succeeded,
		packagesUpgraded: await getPackagesUpgraded(),
		cpuTimeConsumed
	};
}
