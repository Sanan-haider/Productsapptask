import React, { useState } from "react";
import CreateaccountPage from "./pages/createAccount";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
function App() {
  interface myState {
    currentPage: string;
    UserName: string;
    isLoggedIn: boolean;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  }
  const [currentPage, setCurrentPage] = useState<string>("login");
  const [UserName, setUserName] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const State: myState = {
    currentPage,
    UserName,
    isLoggedIn,
    setCurrentPage,
    setUserName,
    setIsLoggedIn,
  };
  const renderPage = () => {
    if (currentPage === "createaccount") {
      return <CreateaccountPage State={State} />;
    } else if (currentPage === "home") {
      return <HomePage State={State} />;
    } else if (currentPage === "login") {
      return <LoginPage State={State} />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;
