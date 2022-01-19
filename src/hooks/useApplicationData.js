import { useState, useEffect } from 'react';
import axios from 'axios';

export function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
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
    //   console.log(first.data, second.data, third.data);
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

  function bookInterview(id, interview) {
    console.log(id, interview);

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    for (let day of state.days){
        if (day.appointments.includes(id)){
            day.spots = day.spots - 1

        }
    }

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(res => {
        setState(prev => ({
          ...prev,
          appointments,
        }));
      })
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    for (let day of state.days){
        if (day.appointments.includes(id)){
            day.spots = day.spots + 1
        }
    }

    return axios.delete(`http://localhost:8001/api/appointments/${id}`).then(res => {
      console.log(res);
      setState(prev => ({
        ...prev,
        appointments,
      }));
    })
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
