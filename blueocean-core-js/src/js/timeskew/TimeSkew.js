import moment from 'moment';


const J_DATE_EXACT = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4})$/i;
const J_DATE_ANY = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4}/ig;
const J_DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ';


export class TimeSkew {

    constructor(referenceMillisUtc) {
        // how far in the future is our reference clock?
        this.skewMillis = referenceMillisUtc - new Date().getTime();
    }

    isDateString(sourceString) {
        return J_DATE_EXACT.test(sourceString);
    }

    transformDatesString(datesString) {
        let result;
        const transforms = [];

        while ((result = J_DATE_ANY.exec(datesString)) !== null) {
            // convert to a moment object that preserves time zone info
            const date = moment(result[0], moment.ISO_8601)
                .utcOffset(result[0]);

            // since the skew is assumed to future, we subtract to adjust to local clock
            date.subtract(this.skewMillis, 'milliseconds');

            transforms.push({
                index: result.index,
                date: date.format(J_DATE_FORMAT),
            });
        }

        const charArray = datesString.split('');

        for (const transform of transforms) {
            charArray.splice(transform.index, transform.date.length, ...transform.date.split(''));
        }

        return charArray.join('');
    }

}
