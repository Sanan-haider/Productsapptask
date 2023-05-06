import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
interface Props {
  State: {
    currentPage: string;
    UserName: string;
    isLoggedIn: boolean;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  };
}
export default function CreateaccountPage(props: Props) {
  const { State } = props;
  const { setCurrentPage, setUserName, setIsLoggedIn } = State;
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const timestamp = new Date().getTime();
    const data = {
      id: uuidv4(),
      login: formData.login,
      password: formData.password,
      timestamp: timestamp,
    };
    const storedData = JSON.parse(localStorage.getItem("data") || "[]");

    if (storedData.some((e: any) => e.login === formData.login)) {
      alert("Username already exists. Please choose a different username.");
      return;
    } else if (formData.login.length === 0 || formData.password.length === 0) {
      alert("Enter your username or password");
    } else {
      storedData.push(data);
      localStorage.setItem("data", JSON.stringify(storedData));
      setCurrentPage("home");
      setIsLoggedIn(true);
      setUserName(formData.login);
    }
  };

  return (
    <div className="login-form">
      <h1>Create your account</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Login:
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <div className="login-buttons">
          <button type="submit">SignIn</button>
          <button onClick={() => setCurrentPage("login")}>Have account?</button>
        </div>
      </form>
    </div>
  );
}
