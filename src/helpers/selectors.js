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
    let finalResult=[];

    for (let appID of appointmentsForDay) {
        if (appointmentsKeys.includes(appID.toString())) {
            finalResult.push(stateCopy.appointments[appID.toString()]);
        }
    }
    return finalResult;
  }