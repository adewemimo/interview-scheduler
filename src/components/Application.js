import React, { useState, useEffect } from 'react';
import 'components/Application.scss';
import DayList from './DayList';
import Appointment from './Appointment';
import axios from 'axios';
import { getAppointmentsForDay, getInterview } from 'helpers/selectors';

// const days = [
//   {
//     id: 1,
//     name: 'Monday',
//     spots: 2,
//   },
//   {
//     id: 2,
//     name: 'Tuesday',
//     spots: 5,
//   },
//   {
//     id: 3,
//     name: 'Wednesday',
//     spots: 0,
//   },
// ];

// const appointments = [
//   {
//     id: 1,
//     time: '12pm',
//   },
//   {
//     id: 2,
//     time: '1pm',
//     interview: {
//       student: 'Lydia Miller-Jones',
//       interviewer: {
//         id: 1,
//         name: 'Sylvia Palmer',
//         avatar: 'https://i.imgur.com/LpaY82x.png',
//       },
//     },
//   },
//   {
//     id: 3,
//     time: '2pm',
//     interview: {
//       student: 'Bunni Jones',
//       interviewer: {
//         id: 2,
//         name: 'Tori Malcolm',
//         avatar: 'https://i.imgur.com/Nmx0Qxo.png',
//       },
//     },
//   },
//   {
//     id: 4,
//     time: '3pm',
//     interview: {
//       student: 'Jonni ',
//       interviewer: {
//         id: 3,
//         name: 'Mildred Nazir',
//         avatar: 'https://i.imgur.com/T2WwVfS.png',
//       },
//     },
//   },
//   {
//     id: 5,
//     time: '4pm',
//   },
//   {
//     id: 6,
//     time: '5pm',
//     interview: {
//       student: 'James John',
//       interviewer: {
//         id: 4,
//         name: 'Cohana Roy',
//         avatar: 'https://i.imgur.com/FK8V841.jpg',
//       },
//     },
//   },
// ];

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: [
      {
        id: 1,
        time: '12pm',
      },
      {
        id: 2,
        time: '1pm',
        interview: {
          student: 'Lydia Miller-Jones',
          interviewer: {
            id: 1,
            name: 'Sylvia Palmer',
            avatar: 'https://i.imgur.com/LpaY82x.png',
          },
        },
      },
      {
        id: 3,
        time: '2pm',
        interview: {
          student: 'Bunni Jones',
          interviewer: {
            id: 2,
            name: 'Tori Malcolm',
            avatar: 'https://i.imgur.com/Nmx0Qxo.png',
          },
        },
      },
      {
        id: 4,
        time: '3pm',
        interview: {
          student: 'Jonni ',
          interviewer: {
            id: 3,
            name: 'Mildred Nazir',
            avatar: 'https://i.imgur.com/T2WwVfS.png',
          },
        },
      },
      {
        id: 5,
        time: '4pm',
      },
      {
        id: 6,
        time: '5pm',
        interview: {
          student: 'James John',
          interviewer: {
            id: 4,
            name: 'Cohana Roy',
            avatar: 'https://i.imgur.com/FK8V841.jpg',
          },
        },
      },
    ],
    interviewers: {}
  });
  // const [days, setDays] = useState([]);
  //const [days, setDays] = useState('Monday');

  useEffect(() => {
    const daysURL = 'http://localhost:8001/api/days';
    const appointmentsURL = 'http://localhost:8001/api/appointments';
    const interviewersURL = 'http://localhost:8001/api/interviewers';
    Promise.all([
      axios.get(daysURL),
      axios.get(appointmentsURL),
      axios.get(interviewersURL),
    ]).then(all => {
      // console.log(all[0].data);
      // console.log(all[1].data);
      // console.log(all[2].data);
      const [first, second, third] = all;
      // console.log(first.data, second.data, third.data);
      setState(prev => ({
        ...prev,
        days: first.data,
        appointments: second.data,
        interviewers: third.data,
      }));
    });
  }, []);

  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => ({ ...prev, days }));

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const schedule = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        {/* Replace this with the sidebar elements during the "Project Setup & Familiarity" activity. */}
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {/* Replace this with the schedule elements during the "The Scheduler" activity. */}
        {schedule && schedule}
        <Appointment key="last" time="6pm" />
      </section>
    </main>
  );
}
