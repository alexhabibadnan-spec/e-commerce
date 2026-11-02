import { useState, useEffect } from 'react';
import { useCart } from "../../context/CartContext.jsx";
import ProductDetailsModal from "./ProductDetailsModal"; // ← নতুন ইমপোর্ট

const API_BASE = 'https://oracleapex.com/ords/ahabib_123/login';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ← নতুন স্টেট মডালের জন্য
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/product/`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProducts(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('API error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-10">Featured Products</h2>
        <p className="text-center text-gray-500">Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-10">Featured Products</h2>
        <p className="text-center text-red-500">Error: {error}</p>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-10">Featured Products</h2>
        <p className="text-center text-gray-500">কোনো প্রোডাক্ট নেই</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-10">Featured Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const imageUrl = `${API_BASE}/product/${product.product_id}/image`;
          const discountedPrice = product.discount
            ? product.price - (product.price * product.discount) / 100
            : product.price;

          return (
            <div
              key={product.product_id}
              onClick={() => setSelectedProduct(product)} // ← কার্ডে ক্লিক করলে মডাল ওপেন হবে
              className="bg-white rounded-xl shadow overflow-hidden hover:shadow-xl transition cursor-pointer group"
            >
              <div className="overflow-hidden">
                <img
                  src={imageUrl}
                  alt={product.product_name}
                  loading="lazy"
                  className="h-56 w-full object-cover bg-gray-50 group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x224?text=No+Image';
                  }}
                />
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {product.product_name}
                </h3>

                {product.discount ? (
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-blue-600 font-bold">
                      ৳{discountedPrice.toFixed(0)}
                    </p>
                    <p className="text-gray-400 line-through text-sm">
                      ৳{product.price}
                    </p>
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                      -{product.discount}%
                    </span>
                  </div>
                ) : (
                  <p className="text-blue-600 font-bold mt-2">
                    ৳{product.price}
                  </p>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // ← এটি মডাল ওপেন হওয়া বন্ধ করবে
                    addToCart({
                      id: product.product_id,
                      name: product.product_name,
                      price: discountedPrice,
                      image: imageUrl,
                    });
                  }}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ← মডালটি এখানে রেন্ডার হবে */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </section>
  );
};

export default FeaturedProducts;