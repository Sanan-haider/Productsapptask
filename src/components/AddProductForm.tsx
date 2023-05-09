import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Form, Input, Button } from "antd";
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
  const [form] = Form.useForm();

  const handleAddProduct = (values: any) => {
    const id = uuidv4();
    const product: Product = {
      id: id,
      name: values.productName,
      unitPrice: Number(values.unitPrice),
      totalPrice: Number(values.totalPrice),
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

    form.resetFields();
    setPage("displayproducts");
  };

  return (
    <div className="forms">
      <Form form={form} onFinish={handleAddProduct}>
        <Form.Item
          label="Name"
          name="productName"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Unit Price"
          name="unitPrice"
          rules={[{ required: true, message: "Please enter the unit price" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Total Price"
          name="totalPrice"
          rules={[{ required: true, message: "Please enter the total price" }]}
        >
          <Input type="number" />
        </Form.Item>
        <div className="login-buttons">
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddProductForm;
