import React, {useState} from 'react';
import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

const Form = function(props) {
  const { interviewers, onSave, onCancel } = props;
  const [name, setName] = useState(props.name || "");
  const [interviewer,setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  function reset(){
    setInterviewer(null);
    setName("")
  }
  function cancel() {
      reset();
      onCancel();
  }

  function handleSubmit(event){
    event.preventDefault();
  }

  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
    onSave(name, interviewer);
  }
 
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off"  onSubmit={handleSubmit}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            value={name}
            placeholder="Enter Student Name"
            onChange={(event) => setName(event.target.value)}
            data-testid="student-name-input"
            /*
          This must be a controlled component
        */
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          interviewers={interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={(event)=>validate()}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
};

export default Form;
