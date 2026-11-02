import { useState } from "react";
import { FiX, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";

const API_BASE = 'https://oracleapex.com/ords/ahabib_123/login';

const ProductDetailsModal = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const imageUrl = `${API_BASE}/product/${product.product_id}/image`;
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const handleAdd = () => {
    // যেহেতু CartContext-এ addToCart একবারে ১টি করে যোগ করে, 
    // আমরা লুপ চালিয়ে quantity অনুযায়ী যোগ করব
    for (let i = 0; i < quantity; i++) {
      onAddToCart({
        id: product.product_id,
        name: product.product_name,
        price: discountedPrice,
        image: imageUrl,
      });
    }
    onClose(); // কার্টে যোগ করার পর মডাল বন্ধ হয়ে যাবে
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      onClick={onClose} // বাইরে ক্লিক করলে বন্ধ হবে
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()} // ভেতরে ক্লিক করলে বন্ধ হবে না
      >
        {/* বাম দিক: ইমেজ */}
        <div className="md:w-1/2 bg-gray-50 relative flex items-center justify-center p-4">
          <img
            src={imageUrl}
            alt={product.product_name}
            className="w-full h-64 md:h-full object-contain rounded-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400?text=No+Image';
            }}
          />
        </div>

        {/* ডান দিক: ডিটেইলস */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
          >
            <FiX size={20} />
          </button>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 mt-4 md:mt-0">
            {product.product_name}
          </h2>
          
          <p className="text-sm text-gray-500 mb-4">Product ID: #{product.product_id}</p>

          {/* Price Section */}
          <div className="mb-6">
            {product.discount ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-blue-600">
                  ৳{discountedPrice.toFixed(0)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ৳{product.price}
                </span>
                <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-md font-semibold">
                  {product.discount}% OFF
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-blue-600">
                ৳{product.price}
              </span>
            )}
          </div>

          {/* Description Placeholder (যেহেতু API-তে description নেই) */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-700 mb-2">Product Details</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              এই প্রোডাক্টটি আমাদের নতুন কালেকশন থেকে বাছাই করা হয়েছে। এটি উচ্চমানের ম্যাটেরিয়াল দিয়ে তৈরি, যা দীর্ঘস্থায়ী এবং আরামদায়ক। আমাদের স্টোর থেকে নিশ্চিন্তে কেনাকাটা করুন।
            </p>
          </div>

          {/* Add to Cart Section */}
          <div className="mt-auto pt-6 border-t border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition rounded-l-lg"
                >
                  <FiMinus />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition rounded-r-lg"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <FiShoppingCart size={20} />
              Add {quantity} to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;