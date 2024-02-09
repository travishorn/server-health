import {
	SERVER_HOST,
	SERVER_USERNAME,
	PRIVATE_KEY_PATH,
	PRIVATE_KEY_PASSPHRASE
} from '$env/static/private';
import { readFileSync } from 'node:fs';
import { Client } from 'ssh2';

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
					reject(data);
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
	const uptimeOutput = await serverCommand('uptime');

	const uptimeRegex =
		/up\s+(.*?),\s+([\s\S]+?)\s+user.*load average:\s+([\d.]+),\s+([\d.]+),\s+([\d.]+)/;
	const matches = uptimeOutput.match(uptimeRegex);

	return {
		'1min': parseFloat(matches[3]),
		'5min': parseFloat(matches[4]),
		'15min': parseFloat(matches[5])
	};
}
