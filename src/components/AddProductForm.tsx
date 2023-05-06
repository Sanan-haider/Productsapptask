import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Dispalyproducts from "../pages/home/index";
interface Props {
  UserName: string;
  userProducts: Product[];
  setUserProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

interface Product {
  id: string;
  name: string;
  unitPrice: number;
  totalPrice: number;
}

const AddProductForm: React.FC<Props> = (props) => {
  const { UserName, userProducts, setUserProducts } = props;
  const [Page, setPage] = useState<string>("");
  const [productName, setProductName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = uuidv4();
    const product: Product = {
      id: id,
      name: productName,
      unitPrice: Number(unitPrice),
      totalPrice: Number(totalPrice),
    };

    const updatedProducts = [...userProducts, product];
    setUserProducts(updatedProducts);

    // Update local storage
    const storedData = JSON.parse(localStorage.getItem("data") || "[]");
    const currentUser = storedData.find(
      (userData: any) => userData.login === UserName
    );
    if (currentUser) {
      currentUser.products = updatedProducts;
      localStorage.setItem("data", JSON.stringify(storedData));
    }

    setProductName("");
    setUnitPrice("");
    setTotalPrice("");
    setPage("displayproducts");
  };

  return (
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
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
