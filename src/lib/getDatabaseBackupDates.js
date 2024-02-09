import serverCommand from './serverCommand.js';
import parseDatabaseBackupTimestamp from './parseDatabaseBackupTimestamp.js';

export default async function () {
	// Get the journalctl output for the db backup job
	const stdout = await serverCommand('ls -lh /var/mariadb/backup');

	const datesArray = stdout
		.split('\n')
		.map((line) => {
			const dateMatch = line.match(/\d{8}T\d{6}Z/);
			return dateMatch ? parseDatabaseBackupTimestamp(dateMatch[0]) : null;
		})
		.filter((date) => date !== null);

	return {
		datesArray
	};
}
