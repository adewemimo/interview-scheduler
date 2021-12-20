import React from 'react';
import './InterviewerListItem.scss';
import classnames from 'classnames';

const InterviewerListItem = function (props) {
    const {avatar, id, name, selected} = props;

    console.log('props----',props)
    let InterviewerClass = classnames(
        'interviewers__item',
         {
        'interviewers__item--selected': selected,
      });

      const showName = () => {
        if (selected){
            return <span>{name}</span>
        }
    }
  return (
    <li className={InterviewerClass} onClick={() => props.setInterviewer(name)}>
      <img
        className='interviewers__item-image interviewers__item--selected-image'
        src={avatar}
        alt={name}
      />
      {showName()}
    </li>
  );
};

export default InterviewerListItem;
