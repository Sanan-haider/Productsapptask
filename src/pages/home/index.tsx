import React, { useState } from "react";
import AddProductForm from "../../components/AddProductForm";
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
export default function HomePage(props: Props) {
  interface Product {
    id: string;
    name: string;
    unitPrice: number;
    totalPrice: number;
  }
  const { State } = props;
  const { UserName, setCurrentPage, setIsLoggedIn } = State;
  const [Page, setPage] = useState<string>("login");
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
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("login");
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filteredProducts = filterProducts(userProducts, searchTerm);
    setUserProducts(filteredProducts);
  };

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm === "") {
      // If the search term is empty, show all products
      setUserProducts(userProducts);
    }
  };

  const filterProducts = (products: any, searchTerm: string) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return products.filter((p: any) =>
      p.name.toLowerCase().includes(lowercasedSearchTerm)
    );
  };
  return (
    <div>
      <nav>
        <div className="nav">
          <h2>Welcome, {UserName}</h2>
          <div className="rightbuttons">
            {Page === "addproduct" ? null : (
              <button
                className="add-prod"
                onClick={() => setPage("addproduct")}
              >
                Add Product
              </button>
            )}

            {Page === "home" || Page === "login" ? null : (
              <button className="add-prod" onClick={() => setPage("home")}>
                Display Product
              </button>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <div className="products">
        {Page === "addproduct" ? <h2>Add Products</h2> : <h2>My Products</h2>}

        {Page === "addproduct" ? (
          <div>
            <AddProductForm
              UserName={UserName}
              userProducts={userProducts}
              setUserProducts={setUserProducts}
            />
          </div>
        ) : (
          <div>
            <form className="searchform" onSubmit={handleSearch}>
              <label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                />
              </label>
              <div className="login-buttons">
                <button type="submit">Search</button>
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
          </div>
        )}
      </div>
    </div>
  );
}
