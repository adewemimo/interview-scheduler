import React from 'react';
import DayListItem from './DayListItem';

let DayList = function (props) {
  const { days, setDay } = props;

  const dayList = days.map(day => {
    return (
      <DayListItem
        key = {day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.day}
        setDay={event => setDay(day.name)}
      />
    );
  });

  return <ul>{dayList}</ul>;
};

export default DayList;
