export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  let stateCopy = { ...state };
  if (stateCopy.days.length === 0) {
    return [];
  }
  let result = stateCopy.days.filter(d => d.name === day);
  if (result.length === 0) {
    return [];
  }
  let appointmentsForDay = result[0].appointments;
  let appointmentsKeys = Object.keys(stateCopy.appointments);
  let finalResult = [];

  for (let appID of appointmentsForDay) {
    if (appointmentsKeys.includes(appID.toString())) {
      finalResult.push(stateCopy.appointments[appID.toString()]);
    }
  }
  return finalResult;
}

export function getInterview(state, interview) {
  //... returns an interview object for the given interview
  //... or null if there is no interview
  let stateCopy = { ...state };
  let finalResult = {};
  const appointmentsValues = Object.values(stateCopy.appointments);
  if (interview === null) {
    return null;
  }
  appointmentsValues.map(appointment => {
    let interviewersKeys = Object.keys(stateCopy.interviewers);
    let interviewersId = interview.interviewer;
    let interviewerDetails = {};
    if (interviewersKeys.includes(interviewersId.toString())) {
      interviewerDetails = stateCopy.interviewers[interviewersId.toString()];
      finalResult = {
        student: interview.student,
        interviewer: interviewerDetails,
      };
    }
    return appointment
  });
  return finalResult;
}

export function getInterviewersForDay(state, day) {
  //... returns an array of interviews for that day
  let stateCopy = { ...state };
  if (stateCopy.days.length === 0) {
    return [];
  }
  let result = stateCopy.days.filter(d => d.name === day);
  if (result.length === 0) {
    return [];
  }
  let interviewersForDay = result[0].interviewers;
  let interviewersKeys = Object.keys(stateCopy.interviewers);
  let finalResult = [];

  for (let interviewerID of interviewersForDay) {
    if (interviewersKeys.includes(interviewerID.toString())) {
      finalResult.push(stateCopy.interviewers[interviewerID.toString()]);
    }
  }
  return finalResult;
}
