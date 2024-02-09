import {
	getSystemUpSince,
	getLoadAverages,
	getRebootRequired,
	getLatestDatabaseBackup
} from '../lib/index.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		systemUpSince: await getSystemUpSince(),
		loadAverages: await getLoadAverages(),
		rebootRequired: await getRebootRequired(),
		latestDatabaseBackup: await getLatestDatabaseBackup()
	};
}
