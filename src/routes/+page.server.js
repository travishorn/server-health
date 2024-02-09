import { getSystemUpSince, getLoadAverages, getRebootRequired } from '../lib/index.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const systemUpSince = await getSystemUpSince();
	const loadAverages = await getLoadAverages();
	const rebootRequired = await getRebootRequired();

	return {
		systemUpSince,
		loadAverages,
		rebootRequired
	};
}
