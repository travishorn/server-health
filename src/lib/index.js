import {
	SERVER_HOST,
	SERVER_USERNAME,
	PRIVATE_KEY_PATH,
	PRIVATE_KEY_PASSPHRASE,
	REMOTE_USER_PASSWORD
} from '$env/static/private';
import { readFileSync } from 'node:fs';
import { Client } from 'ssh2';
import { DateTime, Duration } from 'luxon';

const privateKey = readFileSync(PRIVATE_KEY_PATH);

/**
 * Run a command on the server
 * @param {string} command
 * @returns
 */
export async function serverCommand(command) {
	return new Promise((resolve, reject) => {
		const conn = new Client();
		let response = '';

		conn.on('ready', () => {
			conn.exec(command, (err, stream) => {
				if (err) reject(err);

				stream.on('close', () => {
					conn.end();
					resolve(response);
				});

				stream.on('data', (/** @type {string} */ data) => {
					response += data;
				});

				stream.stderr.on('data', (/** @type {string} */ data) => {
					if (data.toString().slice(0, 6) === '[sudo]') {
						stream.write(`${REMOTE_USER_PASSWORD}\n`);
					} else {
						reject(data.toString());
					}
				});
			});
		});

		conn.connect({
			host: SERVER_HOST,
			username: SERVER_USERNAME,
			privateKey,
			passphrase: PRIVATE_KEY_PASSPHRASE
		});
	});
}

export async function getSystemUpSince() {
	return new Date(await serverCommand('uptime -s'));
}

export async function getLoadAverages() {
	const stdout = await serverCommand('uptime');

	const uptimeRegex =
		/up\s+(.*?),\s+([\s\S]+?)\s+user.*load average:\s+([\d.]+),\s+([\d.]+),\s+([\d.]+)/;
	const matches = stdout.match(uptimeRegex);

	return {
		'1min': parseFloat(matches[3]),
		'5min': parseFloat(matches[4]),
		'15min': parseFloat(matches[5])
	};
}

export async function getRebootRequired() {
	try {
		const stdout = await serverCommand('ls /var/run/reboot-required');
		return stdout === '/var/run/reboot-required\n';
	} catch (err) {
		return err === "ls: cannot access '/var/run/reboot-required': No such file or directory";
	}
}

/**
 * Takes a duration string from journalctl like "3min 25.870s" and converts it to milliseconds
 * @param {string} durationString A string representing a duration like "3min 25.870s"
 * @returns {number|undefined} The duration in milliseconds
 */
function parseJournalDuration(durationString) {
	if (!durationString) {
		return undefined; // or handle the undefined case as needed
	}

	// Regular expression to extract components (hours, minutes, seconds)
	const regex = /(\d+(\.\d+)?)(hr|h|min|s)/g;
	let matches = durationString.matchAll(regex);

	// Convert matches to an object with keys as units and values as corresponding numbers
	const durationComponents = {};
	for (const match of matches) {
		const value = parseFloat(match[1]);
		const unit = match[3];

		switch (unit) {
			case 'h':
			case 'hr':
				durationComponents.hours = value;
				break;
			case 'min':
				durationComponents.minutes = value;
				break;
			case 's':
				durationComponents.minutes = value;
				break;
		}
	}

	// Create Luxon duration object
	const luxonDuration = Duration.fromObject(durationComponents);

	return luxonDuration.toMillis();
}

/**
 * Takes a timestamp string from journalctl like "Feb 09 00:03:28" and converts it to a JavaScript date
 * @param {string} dateTimeString A string representing a datetime like "Feb 09 00:03:28"
 * @returns {Date} A JavaScript date
 */
function parseJournalTimestamp(dateTimeString) {
	return DateTime.fromFormat(dateTimeString, 'LLL dd HH:mm:ss').toJSDate();
}

export async function getLatestDatabaseBackup() {
	const stdout = await serverCommand('sudo -S journalctl -n 2 -u backup_databases.service');
	const lines = stdout.split('\n');
	let timestamp;
	let succeeded = false;
	let cpuTimeConsumed;

	for (const line of lines) {
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
