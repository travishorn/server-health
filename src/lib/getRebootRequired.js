import serverCommand from './serverCommand.js';

export default async function () {
	try {
		const stdout = await serverCommand('ls /var/run/reboot-required');

		// If the output of the command is /var/run/reboot-required, a reboot is required
		return stdout === '/var/run/reboot-required\n';
	} catch (err) {
		// If the file doesn't exist, no reboot is required
		return err === "ls: cannot access '/var/run/reboot-required': No such file or directory";
	}
}
