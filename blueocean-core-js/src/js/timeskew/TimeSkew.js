import moment from 'moment';


const J_DATE_EXACT = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4})$/i;
const J_DATE_ANY = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4}/ig;
const J_DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ';

const canWalk = (item) => item && (typeof item === 'object' || Array.isArray(item));
const DEFAULT_IGNORED_PROPS = [];


export class TimeSkew {

    constructor(referenceMillisUtc) {
        // how far in the future is our reference clock?
        this.skewMillis = referenceMillisUtc - new Date().getTime();
        this.debugEnabled = false;
        this.debugInfo = {
            classesTested: [],
            fieldsTested: 0,
            valuesTransformed: [],
        };
    }

    enableDebug() {
        this.debugEnabled = true;
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

        if (this.debugEnabled) {
            this.debugInfo.valuesTransformed = transforms.length;
        }

        const charArray = datesString.split('');

        for (const transform of transforms) {
            charArray.splice(transform.index, transform.date.length, ...transform.date.split(''));
        }

        return charArray.join('');
    }

    transformDatesObject(datesObject) {
        const classMap = {};
        const nodesToWalk = [datesObject];
        const nodesAlreadyWalked = [];
        const ignoredProps = DEFAULT_IGNORED_PROPS.slice();

        let node = nodesToWalk.shift();
        let keysWithDateValues = [];

        while (node) {
            nodesAlreadyWalked.push(node);

            let shouldSkipNode = false;
            let shouldTestAllFields = true;

            if (typeof node === 'object') {
                // if an object, we want to either
                // 1. test all its fields for dates if we haven't seen it before
                // 2. skip the object entirely if we've seen it and didn't find date fields
                // 3. transform its date fields but don't inspect any other fields
                if (node._class) {
                    if (classMap[node._class] === undefined) {
                        keysWithDateValues = classMap[node._class] = [];
                        shouldTestAllFields = true;
                    } else if (classMap[node._class] === null) {
                        shouldSkipNode = true;
                    } else {
                        keysWithDateValues = classMap[node._class];
                        shouldTestAllFields = false;
                    }
                } else {
                    keysWithDateValues = [];
                }
            }

            if (!shouldSkipNode) {
                if (shouldTestAllFields) {
                    const nodeKeys = Object.keys(node);

                    for (const key of nodeKeys) {
                        const value = node[key];

                        if (typeof value === 'string') {
                            if (this.debugEnabled) {
                                this.debugInfo.fieldsTested++;
                            }
                            if (this.isDateString(value)) {
                                keysWithDateValues.push(key);
                            }
                        }

                        // walk this node at a later iteration as long as
                        // - we didn't already walk it (cycles cause an infinite loop otherwise)
                        // - the property name isn't on the blacklist
                        if (canWalk(value) && nodesAlreadyWalked.indexOf(value) === -1 && ignoredProps.indexOf(key) === -1) {
                            nodesToWalk.push(value);
                        }
                    }

                    // record the class as having no date fields with 'null' value
                    if (node._class && keysWithDateValues.length === 0) {
                        classMap[node._class] = null;
                    }

                    if (this.debugEnabled && node._class) {
                        this.debugInfo.classesTested.push(node._class);
                    }
                }

                // transform only the fields we know to be of date type
                if (keysWithDateValues.length > 0) {
                    for (const key1 of keysWithDateValues) {
                        const dateString = node[key1];
                        // convert to a moment object that preserves time zone info
                        const date = moment(dateString, moment.ISO_8601)
                            .utcOffset(dateString);

                        // since the skew is assumed to future, we subtract to adjust to local clock
                        date.subtract(this.skewMillis, 'milliseconds');

                        const newDate = date.format(J_DATE_FORMAT);
                        node[key1] = newDate;

                        if (this.debugEnabled) {
                            this.debugInfo.valuesTransformed.push(`${dateString} to ${newDate}`);
                        }
                    }
                }
            }

            node = nodesToWalk.shift();
        }

        return datesObject;
    }

}
