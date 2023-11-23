import React from 'react';
import { Card, Icon } from 'semantic-ui-react';

const extra = (
    <a>
        <Icon name="user" />
        Nguyeen van a
    </a>
);

const CourseCard = () => (
    <Card
        image="/images/avatar/large/elliot.jpg"
        header="Elliot Baker"
        meta="Course"
        description="Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat."
        extra={extra}
    />
);

export default CourseCard;
