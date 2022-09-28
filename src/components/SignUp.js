import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function SignUp(props) {
    const [credentials, setCredentials] = useState({name: "", email: "", password: "", cpassword: ""});
    let history = useHistory();

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.id]:e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name, email, password} = credentials;
        const res = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, email, password})
        });
        const parsedData = await res.json();
        if(parsedData.authtoken) {
            localStorage.setItem("token", parsedData.authtoken);
            props.showAlert("User Created Successfully.", "success");
            history.push("/");
        }
        else {
            props.showAlert("Invalid Details.", "danger");
        }
    }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            required
            onChange={handleChange}
            value={credentials.name}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            onChange={handleChange}
            required
            value={credentials.email}
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            minLength={6}
            onChange={handleChange}
            required
            value={credentials.password}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            minLength={6}
            onChange={handleChange}
            required
            value={credentials.cpassword}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignUp;
