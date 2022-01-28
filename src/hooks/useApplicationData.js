import { useEffect, useReducer } from 'react';
import axios from 'axios';

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

export function useApplicationData() {
  //Logic to use useReducer in place of setState

  const initialState = {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  };

  const updatedSpots = (day, appointments) => {
    let spots = 0;
    for (let id of day.appointments){
    const appointment = appointments[id];
    if (!appointment.interview){
      spots++;
    }
    return spots;
  }}

  // function reducer(state, action) {
  //   switch (action.type) {
  //     case SET_DAY:
  //       return {
  //         ...state,
  //         day: action.day,
  //       };
  //     case SET_APPLICATION_DATA:
  //       return {
  //         ...state,
  //         days: action.days,
  //         appointments: action.appointments,
  //         interviewers: action.interviewers,
  //       };
  //     case SET_INTERVIEW: {
  //       const id = action.id;
  //       const interview = action.interview;

  //       const appointment = {
  //         ...state.appointments[id],
  //         interview: interview ? { ...interview } : null,
  //       };

  //       const appointments = {
  //         ...state.appointments,
  //         [id]: appointment,
  //       };


  //       const dayObj = state.days.find(day => day.name === state.day);
  //       const spots = updatedSpots(dayObj, appointments);
  //       const day = {...dayObj, spots};

  //       const UpdatedDays = state.days.map(d => day.name === state.day ? day : d);

  //       return {
  //         ...state,
  //         appointments,
  //         UpdatedDays
  //       };
  //     }
  //     default:
  //       throw new Error(
  //         `Tried to reduce with unsupported action type: ${action.type}`
  //       );
  //   }
  // }
  const [state, dispatch] = useReducer(reducer, initialState);

  const setDay = day => dispatch({ type: SET_DAY, day });
  const url = process.env.REACT_APP_WEBSOCKET_URL;
  const webSocket = new WebSocket(url);

  useEffect(() => {
    const daysURL = 'http://localhost:8001/api/days';
    const appointmentsURL = 'http://localhost:8001/api/appointments';
    const interviewersURL = 'http://localhost:8001/api/interviewers';
    Promise.all([
      axios.get(daysURL),
      axios.get(appointmentsURL),
      axios.get(interviewersURL),
    ]).then(all => {
      const [first, second, third] = all;
      //   console.log(first.data, second.data, third.data);
      const days = first.data;
      const appointments = second.data;
      const interviewers = third.data;
      dispatch({
        type: SET_APPLICATION_DATA,
        days,
        appointments,
        interviewers,
      });
    });

    //connect to server
    //send message to server
    webSocket.onopen = function (event) {
      webSocket.send('ping');
    };
    webSocket.onclose = () => console.log('ws closed');
    return () => {
      webSocket.close();
    };
  }, []);

  useEffect(() => {
    // message received from the server
    webSocket.onmessage = function (event) {
        console.log('data',event.data);
        const data = JSON.parse(event.data)
      console.log(`Message Received: , ${JSON.parse(event.data)}`);
      if (data.type === SET_INTERVIEW){
          dispatch({ type: data.type, id: data.id, interview: data.interview });
      }
    };

  }, [state]);

  function bookInterview(id, interview) {

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(res => dispatch({ type: SET_INTERVIEW, id, interview }));
  }

  function cancelInterview(id) {

    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then(res => dispatch({ type: SET_INTERVIEW, id, interview: null }));
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
