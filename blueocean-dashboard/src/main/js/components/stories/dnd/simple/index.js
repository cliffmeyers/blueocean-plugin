import React from 'react';
import { storiesOf } from '@kadira/storybook';

import Container from './Container';

storiesOf('react-dnd', module)
    .add('Container', containerStory)
;


function containerStory() {
    return <Container />;
}
