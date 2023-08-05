import React, { useEffect, useRef } from 'react';

function NameWithAttendance({ student, currentkey, selected }) {
  const myRef = useRef(null);

  useEffect(() => {
    if (selected) {
      myRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selected]);

  return (
    <div
      ref={myRef}
      key={currentkey}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        columnGap: '10px',
        padding: '10px',
        backgroundColor: selected ? 'lightblue' : 'white',
      }}
    >
      <h1>{`${currentkey + 1}. ${student.name}`}</h1>
      <input
        className="le-checkbox"
        type="checkbox"
        checked={student.attendance}
        disabled
      />
    </div>
  );
}

export default NameWithAttendance;
