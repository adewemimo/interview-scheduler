import { useEffect, useReducer } from 'react';

export const SET_DAY = 'SET_DAY';
export const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
export const SET_INTERVIEW = 'SET_INTERVIEW';

const updatedSpots = (day, appointments) => {
    let spots = 0;
    for (let id of day.appointments){
    const appointment = appointments[id];
    if (!appointment.interview){
      spots++;
    }
    return spots;
  }}

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


        const dayObj = state.days.find(day => day.name === state.day);
        const spots = updatedSpots(dayObj, appointments);
        const day = {...dayObj, spots};

        const UpdatedDays = state.days.map(d => day.name === state.day ? day : d);

        return {
          ...state,
          appointments,
          UpdatedDays
        };
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  export default reducer;