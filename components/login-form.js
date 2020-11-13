import React from 'react';
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

export default function LoginForm() {
  const { register, handleSubmit, watch, errors } = useForm();

  console.log(watch("email")); // watch input value by passing the name of it

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="field is-grouped">
        <p className="control has-icons-left">
          <span className="icon is-left">
            <FontAwesomeIcon icon={faEnvelope} />
          </span>
          <input className="input is-info" type="email" name="email" placeholder="Email address" required ref={register()} />
        </p>
        <p className="control">
          <button className="button is-info" type="submit">
            <span className="icon is-left">
              <FontAwesomeIcon icon={faSignInAlt} />
            </span>
            <span>Enter</span>
          </button>
        </p>
      </div>
    </form >
  );
}

async function onSubmit(data) {
  console.log('onSubmit:', data);
  try {
    let res = await axios.post('/api/login/request', data)
    console.log('Response:', res);
  } catch (e) {
    console.error(e)
  }
}