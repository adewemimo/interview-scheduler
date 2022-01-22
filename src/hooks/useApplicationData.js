import { useEffect, useReducer, useRef } from 'react';
import axios from 'axios';

export function useApplicationData() {
  //Logic to use useReducer in place of setState

  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';

  const initialState = {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  };

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.day,
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers,
        };
      case SET_INTERVIEW: {
        const id = action.id;
        const interview = action.interview;

        const appointment = {
          ...state.appointments[id],
          interview: interview ? { ...interview } : null,
        };

        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };

        // const daysCopy = [...state.days];
        // const updatedDays = daysCopy.map(day => {
        //   if (day.appointments.includes(id)) {
        //     if (interview) {
        //       return {
        //         ...day,
        //         spots: day.spots - 1,
        //       };
        //     }
        //     return {
        //       ...day,
        //       spots: day.spots + 1,
        //     };
        //   }
        //   return day;
        // });

        return {
          ...state,
          appointments,
          //   updatedDays
        };
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  const setDay = day => dispatch({ type: SET_DAY, day });

  const webSocket = useRef(null);

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
    const url = process.env.REACT_APP_WEBSOCKET_URL;
    webSocket.current = new WebSocket(url);
    //send message to server
    webSocket.current.onopen = function (event) {
      webSocket.current.send('ping');
    };
    webSocket.current.onclose = () => console.log('ws closed');
    const webSocketCurrent = webSocket.current;
    return () => {
      webSocketCurrent.close();
    };
  }, []);

  useEffect(() => {
    // message received from the server
    webSocket.current.onmessage = function (event) {
        console.log('data',event.data);
        const data = JSON.parse(event.data)
      console.log(`Message Received: , ${JSON.parse(event.data)}`);
      if (data.type === SET_INTERVIEW){
          console.log("Hello");
          dispatch({ type: data.type, id: data.id, interview: data.interview });
      }
    };

  }, [state.appointments]);

  function bookInterview(id, interview) {
    for (let day of state.days) {
      if (day.appointments.includes(id)) {
        day.spots = day.spots - 1;
      }
    }

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(res => dispatch({ type: SET_INTERVIEW, id, interview }));
  }

  function cancelInterview(id, interview) {
    for (let day of state.days) {
      if (day.appointments.includes(id)) {
        day.spots = day.spots + 1;
      }
    }

    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then(res => dispatch({ type: SET_INTERVIEW, id, interview: null }));
  }

  //Logic below uses setState. Code is commented out and kept for references.
  //   const [state, setState] = useState({
  //     day: 'Monday',
  //     days: [],
  //     appointments: {},
  //     interviewers: {},
  //   });
  //   // const [days, setDays] = useState([]);
  //   //const [days, setDays] = useState('Monday');

  //   useEffect(() => {
  //     const daysURL = 'http://localhost:8001/api/days';
  //     const appointmentsURL = 'http://localhost:8001/api/appointments';
  //     const interviewersURL = 'http://localhost:8001/api/interviewers';
  //     Promise.all([
  //       axios.get(daysURL),
  //       axios.get(appointmentsURL),
  //       axios.get(interviewersURL),
  //     ]).then(all => {
  //       // console.log(all[0].data);
  //       // console.log(all[1].data);
  //       // console.log(all[2].data);
  //       const [first, second, third] = all;
  //       //   console.log(first.data, second.data, third.data);
  //       setState(prev => ({
  //         ...prev,
  //         days: first.data,
  //         appointments: second.data,
  //         interviewers: third.data,
  //       }));
  //     });
  //   }, []);

  //   const setDay = day => setState({ ...state, day });
  //   // const setDays = days => setState(prev => ({ ...prev, days }));

  //   function bookInterview(id, interview) {
  //     console.log(id, interview);

  //     const appointment = {
  //       ...state.appointments[id],
  //       interview: { ...interview },
  //     };

  //     const appointments = {
  //       ...state.appointments,
  //       [id]: appointment,
  //     };

  //     for (let day of state.days) {
  //       if (day.appointments.includes(id)) {
  //         day.spots = day.spots - 1;
  //       }
  //     }

  //     return axios
  //       .put(`http://localhost:8001/api/appointments/${id}`, { interview })
  //       .then(res => {
  //         setState(prev => ({
  //           ...prev,
  //           appointments,
  //         }));
  //       });
  //   }

  //   function cancelInterview(id) {
  //     const appointment = {
  //       ...state.appointments[id],
  //       interview: null,
  //     };

  //     const appointments = {
  //       ...state.appointments,
  //       [id]: appointment,
  //     };

  //     for (let day of state.days) {
  //       if (day.appointments.includes(id)) {
  //         day.spots = day.spots + 1;
  //       }
  //     }

  //     return axios
  //       .delete(`http://localhost:8001/api/appointments/${id}`)
  //       .then(res => {
  //         console.log(res);
  //         setState(prev => ({
  //           ...prev,
  //           appointments,
  //         }));
  //       });
  //   }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
