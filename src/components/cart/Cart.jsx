import { useState } from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCart } from "../../context/CartContext.jsx";

// 🔑 singular "order" 
const API_BASE = "https://oracleapex.com/ords/ahabib_123/login/order";
const DELIVERY_COST = 60;
const APPLICATION_COST = 20;

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    address: "",
  });

  // ===== Calculations =====
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryCost = cartItems.length > 0 ? DELIVERY_COST : 0;
  const applicationCost = cartItems.length > 0 ? APPLICATION_COST : 0;
  const totalPayment = subtotal + deliveryCost + applicationCost;

  // ===== Quantity handlers =====
  const increaseQuantity = (item) => {
    updateQuantity(item.name, item.quantity + 1);
  };

  const decreaseQuantity = (item) => {
    if (item.quantity === 1) {
      removeFromCart(item.name);
      return;
    }
    updateQuantity(item.name, item.quantity - 1);
  };

  // ===== Form handlers =====
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    if (submitting) return;
    setShowCheckout(false);
    setOrderResult(null);
  };

  // ===== API POST: Confirm Order =====
  const handleConfirmOrder = async (e) => {
  e.preventDefault();

  if (!form.customer_name.trim()) { alert("Write Your Name"); return; }
  if (!form.phone.trim()) { alert("Write Your Phone No"); return; }
  if (!form.address.trim()) { alert("Your address here"); return; }

  setSubmitting(true);
  setOrderResult(null);

  // unique id creation
  const orderId = Date.now();

  try {
    // Each of card post
    const results = await Promise.all(
      cartItems.map((item) =>
        fetch(`${API_BASE}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            customer_name: form.customer_name.trim(),
            email: form.email.trim() || null,
            phone: form.phone.trim(),
            address: form.address.trim(),
            subtotal,
            delivery_cost: deliveryCost,
            application_cost: applicationCost,
            total_amount: totalPayment,
            product_id: item.id,
            product_name: item.name,
            unit_price: item.price,
            quantity: item.quantity,
            line_total: item.price * item.quantity,
          }),
        })
      )
    );

    const allOk = results.every((r) => r.ok);

    if (allOk) {
      setOrderResult({
        success: true,
        order_id: orderId,
        message: "Order placed successfully",
      });
      clearCart();
    } else {
      setOrderResult({
        success: false,
        message: "Some of item not saved try again",
      });
    }
  } catch (err) {
    console.error("Order error:", err);
    setOrderResult({
      success: false,
      message: "Network Error: " + err.message,
    });
  } finally {
    setSubmitting(false);
  }
};

  // ===== Success Screen =====
  if (orderResult?.success) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-700 mb-3">
            Order confirmation successfull!
          </h1>
          <p className="text-gray-700 text-lg">
            your order no:{" "}
            <strong className="text-green-700">
              #{orderResult.order_id}
            </strong>
          </p>
          <p className="text-gray-600 mt-3">
            We will contact you soon
          </p>
          <a
            href="/"
            className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Continue Shopping
          </a>
        </div>
      </section>
    );
  }

  // ===== Empty Cart =====
  if (cartItems.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
          <p className="text-gray-500 mt-3">
            Add some products to your cart first.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ============ Cart Products ============ */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full sm:w-28 h-28 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-blue-600 font-semibold mt-1">
                  ৳{item.price}
                </p>
                <p className="text-sm text-gray-500 mt-1">Price per item</p>
              </div>

              <div className="flex items-center border rounded-lg w-fit">
                <button
                  onClick={() => decreaseQuantity(item)}
                  className="p-2 hover:bg-gray-100"
                >
                  <FiMinus />
                </button>
                <span className="px-4 font-semibold">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item)}
                  className="p-2 hover:bg-gray-100"
                >
                  <FiPlus />
                </button>
              </div>

              <div className="font-bold text-lg min-w-[100px] text-right">
                ৳{item.price * item.quantity}
              </div>

              <button
                onClick={() => removeFromCart(item.name)}
                className="text-red-500 hover:text-red-700 p-2"
                title="Remove"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* ============ Order Summary ============ */}
        <div>
          <div className="bg-white rounded-xl shadow p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">৳{subtotal}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Delivery Cost</span>
              <span className="font-semibold">৳{deliveryCost}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Application Cost</span>
              <span className="font-semibold">৳{applicationCost}</span>
            </div>

            <hr className="my-5" />

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total Payment</span>
              <span className="text-2xl font-bold text-blue-600">
                ৳{totalPayment}
              </span>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* ============ Checkout Modal ============ */}
      {showCheckout && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-2xl font-bold">Checkout</h2>
              <button
                onClick={closeModal}
                disabled={submitting}
                className="text-gray-400 hover:text-gray-700 text-3xl leading-none disabled:opacity-40"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleConfirmOrder} className="p-6 space-y-5">
              {orderResult && !orderResult.success && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {orderResult.message}
                </div>
              )}

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  placeholder="Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  disabled={submitting}
                  placeholder="example@email.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone No <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  placeholder="01xxx"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  rows={3}
                  placeholder="address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100"
                />
              </div>

              {/* Order total preview */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">
                    Delivery + Application
                  </span>
                  <span>৳{deliveryCost + applicationCost}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">৳{totalPayment}</span>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Load Order..." : "Confirm Order"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;