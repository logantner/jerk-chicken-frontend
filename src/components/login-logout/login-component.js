import React from "react";
import FormInput from "../general/form-input-component";

const LoginForm = (props) => {
  return (
    
    <div>
      <form className = "input-form">
        <FormInput name="username" type="text" onChange={props.onChange}></FormInput>
        <FormInput name="password" type="password" onChange={props.onChange}></FormInput>
        <button className="btn btn-primary" onClick={props.onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginForm;