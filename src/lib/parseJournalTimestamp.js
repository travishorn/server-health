import { DateTime } from 'luxon';

/**
 * Takes a timestamp string from journalctl like "Feb 09 00:03:28" and converts it to a JavaScript date
 * @param {string} dateTimeString A string representing a datetime like "Feb 09 00:03:28"
 * @returns {Date} A JavaScript date
 */
export default function (dateTimeString) {
	return DateTime.fromFormat(dateTimeString, 'LLL dd HH:mm:ss').toJSDate();
}
