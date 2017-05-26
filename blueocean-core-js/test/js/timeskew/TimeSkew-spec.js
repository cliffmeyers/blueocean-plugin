import React from 'react';
import { assert } from 'chai';

import { TimeSkew } from '../../../src/js/timeskew/TimeSkew';

function cloneJson(json) {
    const jsonString = (typeof json === 'object') ? JSON.stringify(json) : json;
    return JSON.parse(jsonString);
}

const testDates = {
    utc: '2017-05-25T19:37:26.393+0000',
    edt: '2017-04-21T11:18:56.263-0400',
    cest: '1944-06-06T06:30:00.000+0200',
};

describe('TimeSkew', () => {
    const skewMillis = 1000 * 60 * 5;
    let timeSkew = null;
    let activity = null;

    beforeEach(() => {
        // the "reference clock" is five minutes in the future
        timeSkew = new TimeSkew(Date.now() + skewMillis);
        activity = cloneJson(require('./data/activity-100.json'));
    });

    describe('isDateString', () => {
        it('works', () => {
            assert.isTrue(timeSkew.isDateString('2017-05-25T19:37:26.393+0000'));
        });
    });

    describe('transformDatesString', () => {
        it('handles positive skew', () => {
            const dateString = JSON.stringify(testDates);
            const fixedString = timeSkew.transformDatesString(dateString);
            const fixed = JSON.parse(fixedString);

            assert.equal(fixed.utc, '2017-05-25T19:32:26.393+0000');
            assert.equal(fixed.edt, '2017-04-21T11:13:56.263-0400');
            assert.equal(fixed.cest, '1944-06-06T06:25:00.000+0200');
        });

        it('handles negative skew', () => {
            // reference clock is now behind
            timeSkew = new TimeSkew(Date.now() - skewMillis);

            const dateString = JSON.stringify(testDates);
            const fixedString = timeSkew.transformDatesString(dateString);
            const fixed = JSON.parse(fixedString);

            assert.equal(fixed.utc, '2017-05-25T19:42:26.393+0000');
            assert.equal(fixed.edt, '2017-04-21T11:23:56.263-0400');
            assert.equal(fixed.cest, '1944-06-06T06:35:00.000+0200');
        });

        it('doesnt error for arbitrary large data', () => {
            const dateString = JSON.stringify(activity);
            const begin = Date.now();
            const fixedString = timeSkew.transformDatesString(dateString);
            console.log('transform took ', Date.now() - begin, 'ms');
            JSON.parse(fixedString);
        });
    });
});
