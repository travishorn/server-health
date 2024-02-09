import { Duration } from 'luxon';

/**
 * Takes a duration string from journalctl like "3min 25.870s" and converts it to milliseconds
 * @param {string} durationString A string representing a duration like "3min 25.870s"
 * @returns {number|undefined} The duration in milliseconds
 */
export default function parseJournalDuration(durationString) {
	if (!durationString) {
		return undefined;
	}

	// Regular expression to extract components (hours, minutes, seconds)
	const regex = /(\d+(\.\d+)?)(hr|h|min|s)/g;
	let matches = durationString.matchAll(regex);

	// Convert matches to an object with keys as units and values as corresponding numbers
	const durationComponents = {
		years: 0,
		quarters: 0,
		months: 0,
		weeks: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	};

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
				durationComponents.seconds = value;
				break;
		}
	}

	// Create Luxon duration object
	const luxonDuration = Duration.fromObject(durationComponents);

	return luxonDuration.toMillis();
}