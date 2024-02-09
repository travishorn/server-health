import { DateTime } from 'luxon';

/**
 * Takes a timestamp string from a database back file like "20240125T060000Z" and converts it to a JavaScript date
 * @param {string} dateTimeString A string representing a datetime like "20240125T060000Z"
 * @returns {Date} A JavaScript date
 */
export default function (dateTimeString) {
	return DateTime.fromFormat(dateTimeString, "yyyyMMdd'T'HHmmss'Z'").toJSDate();
}
