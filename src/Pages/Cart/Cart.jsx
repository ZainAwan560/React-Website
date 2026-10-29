import { Link } from "react-router-dom";
import { useCart } from "../../Context/Cart.jsx";
import "./Cart.css";
import { API_BASE_URL } from "../../config/api";
import { getProductImage } from "../../utils/imageHelper";

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, cartTotal } = useCart();

  const discount = Math.round(cartTotal * 0.2);
  const deliveryFee = cart.length > 0 ? 15 : 0;
  const total = cartTotal - discount + deliveryFee;

  // NAYA FUNCTION: Order ko Database mein bhejne ke liye
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");

    const customerName = window.prompt("Enter customer name:", "Ali Khan") || "Guest Customer";
    const customerEmail = window.prompt("Enter customer email:", "ali.khan@example.com") || "customer@example.com";
    const phone = window.prompt("Enter customer phone:", "+92 300 1234567") || "+92 300 1234567";
    const address = window.prompt("Enter delivery address:", "Karachi, Pakistan") || "Karachi, Pakistan";

    const orderData = {
      customerName,
      customerEmail,
      phone,
      address,
      items: cart.map(item => ({
        id: item.id || item._id,
        productId: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color || "Default",
        size: item.size || "Standard",
        image: item.image || ""
      })), 
      totalAmount: total
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("🎉 Order Successfully Place Ho Gaya! Apne MongoDB Atlas mein check karein.");
      } else {
        const errorData = await response.json(); 
        alert("❌ Backend Error: " + errorData.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Server se connect nahi ho pa raha. Kya backend chal raha hai?");
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <strong>Cart</strong>
      </div>

      <h1 className="cart-title">YOUR CART</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.map((item, index) => (
              <div className="cart-item" key={index}>
                <img 
                  src={getProductImage(item.image)} 
                  alt={item.name} 
                  className="cart-item-image" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/products/cloth1.png";
                  }}
                />

                <div className="cart-item-details">
                  <div className="cart-item-top">
                    <div>
                      <h3>{item.name}</h3>
                      {item.size && <p className="cart-item-meta">Size: {item.size}</p>}
                      {item.color && (
                        <p className="cart-item-meta">
                          Color:{" "}
                          <span
                            className="color-dot"
                            style={{ backgroundColor: item.color }}
                          ></span>
                        </p>
                      )}
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id, item.color, item.size)}
                    >
                      🗑
                    </button>
                  </div>

                  <div className="cart-item-bottom">
                    <span className="cart-item-price">${item.price}</span>

                    <div className="qty-box">
                      <button onClick={() => decreaseQuantity(item.id, item.color, item.size)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id, item.color, item.size)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal}</span>
            </div>

            <div className="summary-row discount-row">
              <span>Discount (-20%)</span>
              <span>-${discount}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>${deliveryFee}</span>
            </div>

            <div className="summary-row total-row">
              <span>Total</span>
              <span>${total}</span>
            </div>

            <div className="promo-row">
              <input type="text" placeholder="Add promo code" />
              <button>Apply</button>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>Go to Checkout →</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;