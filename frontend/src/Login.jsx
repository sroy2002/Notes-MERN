import { useState } from "react";
import "./Styles/App.scss";
function Login() {
  const [formData, setFormData] = useState({
    username: "",
    email:"",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preState) => ({ ...preState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="app poppins-bold">
      <div className="form-container">
        <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input-field"
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
          />
        </label>
        <input type="submit" value="Submit" className="btn poppins-bold" />
      </form>
      </div>
    </div>
  );
}

export default Login;
