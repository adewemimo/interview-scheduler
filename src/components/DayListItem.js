import React from 'react';
import './DayListItem.scss';
import classnames from 'classnames';

const Spots = ({ spots }) => {
  if (spots === 0) {
    return <h3>no spots remaining</h3>;
  }

  if (spots === 1) {
    return <h3> {spots} spot remaining</h3>;
  }

  return <h3> {spots} spots remaining</h3>;
};

const DayListItem = ({ name, spots, selected, setDay }) => {
  let dayClass = classnames('day-list__item ', {
    'day-list__item--selected': selected,
    'day-list__item--full': spots === 0,
  });
  return (
    <li onClick={setDay} className={dayClass} data-testid="day">
      <h2 className="text--regular">{name}</h2>
      <Spots spots={spots} />
    </li>
  );
};

export default DayListItem;
