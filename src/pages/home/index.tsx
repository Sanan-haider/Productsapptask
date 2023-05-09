import React, { useState } from "react";
import AddProductForm from "../../components/AddProductForm";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { Console } from "console";
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
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleRefresh = () => {
    setShowLogoutPopup(true);
  };

  const handleUnload = (event: any) => {
    if (hasUnsavedChanges()) {
      event.preventDefault();
      event.returnValue = "";
      return false;
    }
  };

  const hasUnsavedChanges = () => {
    return true;
  };
  React.useEffect(() => {
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("beforeunload", handleRefresh);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("beforeunload", handleRefresh);
    };
  }, []);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
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
    setShowLogoutPopup(false);
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

    if (newSearchTerm.trim() === "") {
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
      {showLogoutPopup && (
        <div className="logout-confirmation-popup">
          <p>Are you sure you want to logout?</p>
          <div className="popu-logout">
            {" "}
            <button onClick={handleLogout}>Logout</button>
            <button onClick={() => setShowLogoutPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
      <nav>
        <div className="nav">
          <h2>Welcome, {UserName}</h2>
          <div className="rightbuttons">
            <button className="add-prod" onClick={openModal}>
              Add Product
            </button>

            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div>
          <div className="overlay"> </div>
          <div className="modal">
            <div className="modal-content">
              <div className="modelclose">
                <button onClick={closeModal}>✖</button>
              </div>

              <div className="buttonandheading">
                <div className="headng">
                  <h2>Add Products</h2>
                </div>
              </div>
              <AddProductForm
                UserName={UserName}
                userProducts={userProducts}
                setUserProducts={setUserProducts}
              />
            </div>
          </div>
        </div>
      )}

      <div className="products">
        <h2>My Products</h2>

        <div>
          <form className="searchform" onSubmit={handleSearch}>
            <label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchTermChange}
              />
              <div className="login-buttons">
                <button type="submit">Search</button>
              </div>
            </label>
          </form>
          <table className="productstable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Unit Price</th>
                <th>Total Price</th>

                <th>Edit/Delete</th>
              </tr>
            </thead>
            <tbody>
              {userProducts
                .slice()
                .reverse()
                .map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.unitPrice}</td>
                    <td>{product.totalPrice}</td>

                    <td>
                      <button onClick={() => handleEditProduct(product)}>
                        <EditIcon />
                      </button>

                      <button onClick={() => handleDeleteProduct(product)}>
                        <DeleteForeverIcon />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
