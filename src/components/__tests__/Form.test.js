import React from 'react';

import { render, cleanup,  fireEvent  } from '@testing-library/react';
import Form from 'components/Appointment/Form';

afterEach(cleanup);

describe('Form', () => {
  const interviewers = [
    {
      id: 1,
      name: 'Sylvia Palmer',
      avatar: 'https://i.imgur.com/LpaY82x.png',
    },
  ];

  it("renders without student name if not provided" , () => {
    const { getByPlaceholderText } = render(<Form interviewers={interviewers}/>);
      expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  })
  it("renders with initial student name", () => {
      const {getByTestId} = render(<Form name="Lydia Miller-Jones" interviewers={interviewers}/>)
      expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  })
  it('renders without crashing', () => {
    render(<Form name="Lydia Miller-Jones" interviewers={interviewers}/>);
  });

  it("validates that the student name is not blank", () => {
    const onSave = jest.fn();

    const {getByText} = render(<Form interviewers={interviewers}  onSave={onSave}/>)

    fireEvent.click(getByText("Save"));

    /* 1. validation is shown */
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    /* 2. onSave is not called */
    expect(onSave).not.toHaveBeenCalled();
  });
  
  it("calls onSave function when the name is defined", () => {
    /* 3. validation is not shown */
    const onSave = jest.fn();

    const {getByText, queryByText} = render(<Form name="Lydia Miller-Jones" interviewers={interviewers} onSave={onSave}/>)

    // onSave("Lydia Miller-Jones", null); This can also be written as:
    fireEvent.click(getByText("Save"));


    expect(queryByText(/student name cannot be blank/i)).toBeNull();
  
    /* 4. onSave is called once*/
    expect(onSave).toHaveBeenCalledTimes(1);
  
    /* 5. onSave is called with the correct arguments */
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", null);
  });

});
