import React from 'react';
import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

const Form = function(props) {
  const { name, interviewers, interviewer, onSave, onCancel } = props;
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            /*
          This must be a controlled component
        */
          />
        </form>
        <InterviewerList
          interviewers={interviewers}
          value={interviewer}
          onChange={props.onChange}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={onCancel}>
            Cancel
          </Button>
          <Button confirm onClick={onSave}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
};

export default Form;
