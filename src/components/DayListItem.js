import React from 'react';
import './DayListItem.scss';
import classnames from 'classnames';

const DayListItem = function (props) {
  const { name, spots, selected, setDay } = props;

  const formatSpots = () => {
    if (spots === 0) {
      return <h3>no spots remaining</h3>;
    }

    if (spots === 1) {
      return <h3> {spots} spot remaining</h3>;
    }

    return <h3> {spots} spots remaining</h3>;
  };

  let dayClass = classnames('day-list__item ', {
    'day-list__item--selected': selected,
    'day-list__item--full': spots === 0,
  });
  return (
    <li onClick={() => setDay(name)} className={dayClass}>
      <h2 className="text--regular">{name}</h2>
      {formatSpots()}
    </li>
  );
};

export default DayListItem;
