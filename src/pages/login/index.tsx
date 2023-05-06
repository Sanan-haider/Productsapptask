import React, { useState } from "react";

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
export default function LoginPage(props: Props) {
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
      login: formData.login,
      password: formData.password,
      timestamp: timestamp,
    };
    const storedData = JSON.parse(localStorage.getItem("data") || "[]");

    if (
      storedData.some(
        (e: any) =>
          e.login === formData.login && e.password === formData.password
      )
    ) {
      setCurrentPage("home");
      setIsLoggedIn(true);
      setUserName(formData.login);
      return;
    } else if (formData.login.length === 0 || formData.password.length === 0) {
      alert("Enter your username or password");
    } else {
      alert("Wrong username and password");
    }
  };

  return (
    <div className="login-form">
      <h1>Welcome to products app</h1>
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
          <button type="submit">Login</button>
          <button onClick={() => setCurrentPage("createaccount")}>
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}
