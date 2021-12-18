import React from 'react';
import DayListItem from './DayListItem';

let DayList = function (props) {
  const { days, setDay } = props;

  const dayList = days.map(day => {
    return (
      <DayListItem
        name={day.name}
        spots={day.spots}
        selected={day.name === props.day}
        setDay={setDay}
      />
    );
  });

  return <ul>{dayList}</ul>;
};

export default DayList;
