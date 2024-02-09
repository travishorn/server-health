import {
	getSystemUpSince,
	getLoadAverages,
	getRebootRequired,
	getLatestDatabaseBackup,
	getDatabaseBackupDates
} from '../lib/index.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		systemUpSince: await getSystemUpSince(),
		loadAverages: await getLoadAverages(),
		rebootRequired: await getRebootRequired(),
		databaseBackups: {
			latest: await getLatestDatabaseBackup(),
			dates: await getDatabaseBackupDates()
		}
	};
}
