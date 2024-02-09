import {
	SERVER_HOST,
	SERVER_USERNAME,
	PRIVATE_KEY_PATH,
	PRIVATE_KEY_PASSPHRASE,
	REMOTE_USER_PASSWORD
} from '$env/static/private';
import { readFileSync } from 'node:fs';
import { Client } from 'ssh2';

const privateKey = readFileSync(PRIVATE_KEY_PATH);

/**
 * Run a command on the server
 * @param {string} command The command to run on the server
 * @returns {Promise<string>} The output of the command
 */
export default async function (command) {
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
