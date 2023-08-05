import React from 'react';
import NameWithAttendance from './NameWithAttendance';

const NameLists = ({ students, selectedIndex }) => (students.map(
  (student, index) => (
    <NameWithAttendance
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      student={student}
      currentkey={index}
      selected={index === selectedIndex}
    />
  ),
));

export default NameLists;
