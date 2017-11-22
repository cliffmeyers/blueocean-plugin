import React from 'react';
import { storiesOf } from '@kadira/storybook';

import Container from './Container';

storiesOf('test 1', module)
    .add('Container', containerStory)
;


function containerStory() {
    return <Container />;
}
