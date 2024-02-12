import {
	getSystemUpSince,
	getLoadAverages,
	getReboot,
	getLatestDatabaseBackup,
	getLatestETLJob,
	getDatabaseBackupDates,
	getUnattendedUpgrade,
	getStorage,
	getMemory,
	getProcesses
} from '../lib/index.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		systemUpSince: await getSystemUpSince(),
		loadAverages: await getLoadAverages(),
		reboot: await getReboot(),
		databaseBackups: {
			latest: await getLatestDatabaseBackup(),
			dates: await getDatabaseBackupDates()
		},
		latestETLJob: await getLatestETLJob(),
		unattendedUpgrade: await getUnattendedUpgrade(),
		storage: await getStorage(),
		memory: await getMemory(),
		processes: await getProcesses()
	};
}
