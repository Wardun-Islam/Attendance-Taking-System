/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import NameLists from './NameLists';

function AttendanceSheet({ labClass, changeRoute, logout }) {
  const [students, setStudents] = useState([]);
  const [index, setIndex] = useState(0);
  const { speak } = useSpeechSynthesis();
  const [isSpeakingOn, setIsSpeakingOn] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      if (index < students.length - 1) {
        setIndex(index + 1);
        if (isSpeakingOn) {
          setTimeout(() => {
            speak({ text: students[index + 1].name });
          }, 500);
        }
      }
    }
    if (e.key === 'ArrowUp') {
      if (index > 0) {
        setIndex(index - 1);
        if (isSpeakingOn) {
          setTimeout(() => {
            speak({ text: students[index - 1].name });
          }, 500);
        }
      }
    }
    if (e.key === 'Enter') {
      setStudents(students.map((student, i) => {
        if (i === index) {
          return {
            ...student,
            attendance: !student.attendance,
          };
        }
        return student;
      }));
    }
    if (e.key === ' ') {
      speak({ text: students[index].name });
    }
    if (e.key === 'Escape') {
      setIsSpeakingOn(!isSpeakingOn);
    }
    /*  on ctrl+S press, send the attendance list to the
     server also prevent default browser save dialog */
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      fetch('http://localhost:8001/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({ data: students, labClass }),
      }).then((response) => {
        if (response.status === 403) {
          sessionStorage.clear();
          changeRoute('');
          logout(false);
        } else {
          response.json().then((data) => {
            console.log(data);
            changeRoute('');
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    }
    if (e.ctrlKey && e.key === 'x') {
      e.preventDefault();
      changeRoute('');
    }
  };

  useEffect(() => {
    fetch(`http://localhost:8001/api/?labClass=${labClass}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('token'),
      },
    }).then((response) => {
      if (response.status === 403) {
        sessionStorage.clear();
        changeRoute('');
        logout(false);
      } else {
        response.json().then((data) => {
          setStudents(data);
        });
      }
    }).catch((err) => {
      console.log(err);
      sessionStorage.clear();
      changeRoute('');
      logout(false);
    });
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflowY: 'scroll',
      }}
      >
        <NameLists students={students} selectedIndex={index} />
      </div>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flexGrow: 3,
        padding: '10px',
        backgroundColor: isSpeakingOn ? 'lightgreen' : 'lightcoral',
      }}
      >
        {students && students.length && <h1>{students[index].name}</h1>}
      </div>
    </div>
  );
}

export default AttendanceSheet;
