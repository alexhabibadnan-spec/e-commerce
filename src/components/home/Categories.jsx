import { useState, useEffect } from 'react';

const API_BASE = 'https://oracleapex.com/ords/ahabib_123/login';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/category/`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCategories(data.items || []);
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
      <section id="categories" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">Shop By Category</h2>
        <p className="text-center text-gray-500">Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="categories" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">Shop By Category</h2>
        <p className="text-center text-red-500">: {error}</p>
      </section>
    );
  }

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-20">
      <h2 className="text-3xl font-bold text-center mb-10">Shop By Category</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {categories.map((item) => (
          <div
            key={item.categ_id}
            className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg transition cursor-pointer"
          >
            {/* BLOB image from ORDS */}
            <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
              <img
                src={`${API_BASE}/category/${item.categ_id}/picture`}
                alt={item.category_name}
                loading="lazy"
                className="max-h-24 max-w-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/96?text=?';
                }}
              />
            </div>

            <h3 className="mt-3 font-semibold text-sm">
              {item.category_name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;