import serverCommand from './serverCommand.js';
import parseJournalTimestamp from './parseJournalTimestamp.js';

async function getRebootRequiredNow() {
	try {
		const stdout = await serverCommand('ls /var/run/reboot-required');

		// If the output of the command is /var/run/reboot-required, a reboot is required
		return stdout === '/var/run/reboot-required\n';
	} catch (err) {
		// If the file doesn't exist, no reboot is required
		return err === "ls: cannot access '/var/run/reboot-required': No such file or directory";
	}
}

export default async function () {
	const stdout = await serverCommand('sudo -S journalctl -n 4 -u unattended_reboot.service');
	const lines = stdout.split('\n');
	let checkedOn;
	let rebootInitiated = false;

	for (const line of lines) {
		const timestampMatch = line.match(/^(\w{3} \d{2} \d{2}:\d{2}:\d{2})/);

		if (timestampMatch) checkedOn = parseJournalTimestamp(timestampMatch[1]);
		if (line.includes('Initiating reboot')) rebootInitiated = true;
	}

	return {
		monthlyReboot: {
			checkedOn,
			rebootInitiated
		},
		rebootRequiredNow: await getRebootRequiredNow()
	};
}
