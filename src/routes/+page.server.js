import { getSystemUpSince, getLoadAverages } from '../lib/index.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const systemUpSince = await getSystemUpSince();
	const loadAverages = await getLoadAverages();

	return {
		systemUpSince,
		loadAverages
	};
}
