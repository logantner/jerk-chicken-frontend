import React from "react";
import axios from "axios";
// import jwt from "jsonwebtoken";
import { connect } from "react-redux";
import FormInput from "../../general/form-input-component";
import Register from "./register-component";
import {logIn} from '../../../redux/actions/logging-actions'

const LoginForm = (props) => {
  const submitLogin = (e) => {
    e.preventDefault();
    (async _ => {
      try {
        console.log("POST body:", props.credentials);
        const response = await axios.post("/users/login", props.credentials);
        // const data = jwt.decode(response.data);

        // console.log(data);
        // console.log(response);

        props.logIn(response.data);
    
        // if(data.roles === 'admin'){
        //   props.history.push('/admin')
        // } else{
        //   if(data.roles === 'user'){
        //     props.history.push('/user')
        //   }
        // }
      } 
      catch (error) {
        console.error(error);
        console.error(error.response);
      }
    })()
  };

  return (
    <form className = "input-form">
      <FormInput name="username" type="text" onChange={props.onChange}></FormInput>
      <FormInput name="password" type="password" onChange={props.onChange}></FormInput>
      <button className="btn btn-primary" onClick={submitLogin}>
        Submit
      </button>
        <Register></Register>
    </form>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    logIn: () =>
      dispatch(logIn()),
  };
}

export default connect(null, mapDispatchToProps)(LoginForm);