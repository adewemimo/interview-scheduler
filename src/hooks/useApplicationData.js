import { useEffect, useReducer } from 'react';
import axios from 'axios';

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
} from 'reducers/application';

export function useApplicationData() {
  //Logic to use useReducer in place of setState

  const initialState = {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const setDay = day => dispatch({ type: SET_DAY, day });
  const url = process.env.REACT_APP_WEBSOCKET_URL;
  const webSocket = new WebSocket(url);

  useEffect(() => {
    const daysURL = '/api/days';
    const appointmentsURL = '/api/appointments';
    const interviewersURL = '/api/interviewers';

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

    // connect to server
    // send message to server
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
      // console.log('data',event.data);
      const data = JSON.parse(event.data);
      // console.log(`Message Received: , ${JSON.parse(event.data)}`);
      if (data.type === SET_INTERVIEW) {
        dispatch({ type: data.type, id: data.id, interview: data.interview });
      }
    };
  }, [state.appointments, state.days.spots, SET_INTERVIEW]);

  function bookInterview(id, interview) {
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(res => dispatch({ type: SET_INTERVIEW, id, interview }));
  }

  function cancelInterview(id) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(res => dispatch({ type: SET_INTERVIEW, id, interview: null }));
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
