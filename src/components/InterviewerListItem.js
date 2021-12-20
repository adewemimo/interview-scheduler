import React from 'react';
import './InterviewerListItem.scss';
import classnames from 'classnames';

const InterviewerListItem = function (props) {
    const {avatar, id, name, selected} = props;

    let InterviewerClass = classnames(
        'interviewers__item',
         {
        'interviewers__item--selected': selected,
      });

  return (
    <li className={InterviewerClass} onClick={props.setInterviewer}>
      <img
        className='interviewers__item-image'
        src={avatar}
        alt={name}
      />
      {selected && name}
    </li>
  );
};

export default InterviewerListItem;
