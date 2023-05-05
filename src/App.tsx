import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [currentPage, setCurrentPage] = useState<string>("login");
  const [UserName, setUserName] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("login");
  };
  function CreateaccountPage() {
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

    function retrieveAllLocalStorageData() {
      const keys = Object.keys(localStorage);
      const data: Record<string, any> = {};

      for (let key of keys) {
        data[key] = localStorage.getItem(key);
      }

      return data;
    }

    console.log(retrieveAllLocalStorageData());
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
      } else if (
        formData.login.length === 0 ||
        formData.password.length === 0
      ) {
        alert("Enter your username or password");
      } else {
        storedData.push(data);
        localStorage.setItem("data", JSON.stringify(storedData));
        setCurrentPage("home");
        setIsLoggedIn(true);
        setUserName(formData.login);

        retrieveAllLocalStorageData();
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
            <button onClick={() => setCurrentPage("login")}>
              Have account?
            </button>
          </div>
        </form>
      </div>
    );
  }

  function LoginPage() {
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
      } else if (
        formData.login.length === 0 ||
        formData.password.length === 0
      ) {
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
  function HomePage() {
    interface Product {
      id: string;
      name: string;
      unitPrice: number;
      totalPrice: number;
    }
    const [productName, setProductName] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [totalPrice, setTotalPrice] = useState("");
    const [userProducts, setUserProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    React.useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem("data") || "[]");
      const currentUser = storedData.find(
        (userData: any) => userData.login === UserName
      );

      if (currentUser && currentUser.products) {
        setUserProducts(currentUser.products);
      }
    }, []);

    const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const id = uuidv4();
      const product: Product = {
        id: id,
        name: productName,
        unitPrice: Number(unitPrice),
        totalPrice: Number(totalPrice),
      };
      const storedData = JSON.parse(localStorage.getItem("data") || "[]");
      const currentUser = storedData.find(
        (userData: any) => userData.login === UserName
      );

      if (currentUser) {
        const updatedProducts = [...userProducts, product];
        currentUser.products = updatedProducts;
        setUserProducts(updatedProducts);
        localStorage.setItem("data", JSON.stringify(storedData));
      }

      setProductName("");
      setUnitPrice("");
      setTotalPrice("");
    };

    const handleEditProduct = (product: Product) => {
      const updatedName = prompt("Enter new product name:", product.name);
      const updatedUnitPrice = prompt(
        "Enter new unit price:",
        String(product.unitPrice)
      );
      const updatedTotalPrice = prompt(
        "Enter new total price:",
        String(product.totalPrice)
      );
      const storedData = JSON.parse(localStorage.getItem("data") || "[]");
      const currentUser = storedData.find(
        (userData: any) => userData.login === UserName
      );

      if (currentUser) {
        const updatedProducts = userProducts.map((p) => {
          if (p.id === product.id) {
            return {
              ...p,
              name: updatedName || p.name,
              unitPrice: Number(updatedUnitPrice) || p.unitPrice,
              totalPrice: Number(updatedTotalPrice) || p.totalPrice,
            };
          } else {
            return p;
          }
        });
        currentUser.products = updatedProducts;
        setUserProducts(updatedProducts);
        localStorage.setItem("data", JSON.stringify(storedData));
      }
    };

    const handleDeleteProduct = (product: Product) => {
      const storedData = JSON.parse(localStorage.getItem("data") || "[]");
      const currentUser = storedData.find(
        (userData: any) => userData.login === UserName
      );

      if (currentUser) {
        const updatedProducts = userProducts.filter((p) => p.id !== product.id);
        currentUser.products = updatedProducts;
        setUserProducts(updatedProducts);
        localStorage.setItem("data", JSON.stringify(storedData));
      }
    };

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const filteredProducts = userProducts.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUserProducts(filteredProducts);
    };
    return (
      <div>
        <nav>
          <div className="nav">
            <h2>Welcome, {UserName}</h2>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
        <div className="products">
          <h2>My Products</h2>
          <div className="forms">
            <form onSubmit={handleAddProduct}>
              <label>
                Name:
                <input
                  type="text"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                />
              </label>
              <label>
                Unit Price:
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(event) => setUnitPrice(event.target.value)}
                />
              </label>
              <label>
                Total Price:
                <input
                  type="number"
                  value={totalPrice}
                  onChange={(event) => setTotalPrice(event.target.value)}
                />
              </label>
              <div className="login-buttons">
                <button type="submit">Add Product</button>
              </div>
            </form>
            <ul className="prod-list">
              {userProducts
                .slice()
                .reverse()
                .map((product) => (
                  <li key={product.id}>
                    <div>Name: {product.name}</div>
                    <div>Unit Price: {product.unitPrice}</div>
                    <div>Total Price: {product.totalPrice}</div>
                    <button onClick={() => handleEditProduct(product)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product)}>
                      Delete
                    </button>
                  </li>
                ))}
            </ul>
            <form onSubmit={handleSearch}>
              <label>
                Search:
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </label>
              <div className="login-buttons">
                <button type="submit">Search</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  function AboutPage() {
    return <h1>Learn more about us on the About page, {UserName}.</h1>;
  }

  const renderPage = () => {
    if (currentPage === "createaccount") {
      return <CreateaccountPage />;
    } else if (currentPage === "home") {
      return <HomePage />;
    } else if (currentPage === "about") {
      return <AboutPage />;
    } else if (currentPage === "login") {
      return <LoginPage />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;
