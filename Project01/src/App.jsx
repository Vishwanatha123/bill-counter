import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("+91 ");

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [items, setItems] = useState([]);
  const [showBill, setShowBill] = useState(false);

  const [billDateTime, setBillDateTime] = useState("");

  // Fetch products from backend
  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleProductChange = (e) => {
    const id = e.target.value;
    setSelectedProductId(id);

    const product = products.find(p => p.id === Number(id));
    setSelectedProduct(product);
  };

  // ✅ ADD ITEM WITH DATE & TIME
  const handleAddItem = () => {

    if (!selectedProduct || quantity <= 0) {
      alert("Please select product and enter valid quantity");
      return;
    }

    const total = selectedProduct.price * quantity;

    const dateTime = new Date().toLocaleString(); // ✅ date + time

    const item = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: quantity,
      total: total,
      dateTime: dateTime
    };

    setItems(prev => [...prev, item]);

    setQuantity(1);
    setSelectedProduct(null);
    setSelectedProductId("");
  };

  // ✅ DELETE ITEM
  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleGenerateBill = () => {

    if (items.length === 0) {
      alert("No items added");
      return;
    }

    const now = new Date();
    const formatted =
      now.toLocaleDateString() + " " + now.toLocaleTimeString();

    setBillDateTime(formatted);

    alert("Bill is generated successfully");
    setShowBill(true);
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <>
      <h1>Bill Counter</h1>

      <div className="customerDetails">

        <div className="customerName">
          <label>Customer Name: </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="customerContact">
          <label>Phone Number: </label>
          <input
            type="text"
            value={customerContact}
            onChange={(e) => setCustomerContact(e.target.value)}
          />
        </div>

      </div>

      <div className="productDetails">

        <div className="productName">
          <label>Product</label>
          <select value={selectedProductId} onChange={handleProductChange}>
            <option value="">Select product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="productPrice">
          <label>Price</label>
          <input
            type="text"
            value={selectedProduct ? selectedProduct.price : ""}
            readOnly
          />
        </div>

        <div className="productQTY">
          <label>Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="TotalAmount">
          <p>
            <b>Total: </b>
            Rs.{selectedProduct ? selectedProduct.price * quantity : 0}
          </p>
        </div>

        <div className="AddItem">
          <button type="button" onClick={handleAddItem}>
            Add Item
          </button>
        </div>

      </div>

      {items.length > 0 && (

        <div className="tableContainer">

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.total}</td>
                  <td>{item.dateTime}</td>
                  <td>
                    <button
                      className="deleteBtn"
                      onClick={() => handleDeleteItem(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          <div className="generateBtn">
            <button onClick={handleGenerateBill}>
              Generate Bill
            </button>
          </div>

        </div>
      )}

      {
  showBill &&

  <div className="billSummary">
    <h3>Bill Summary</h3>

    <p><b>Date & Time:</b> {billDateTime}</p>
    <p><b>Customer:</b> {customerName}</p>
    <p><b>Contact:</b> {customerContact}</p>

    <table className="summaryTable">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>
        {
          items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>Rs.{item.price}</td>
              <td>{item.quantity}</td>
              <td>Rs.{item.total}</td>
            </tr>
          ))
        }
      </tbody>
    </table>

    <p style={{ marginTop: "10px" }}>
      <b>Total Items:</b> {items.length}
    </p>

    <p>
      <b>Grand Total:</b> Rs.{grandTotal}
    </p>
  </div>
}

    </>
  );
}

export default App;