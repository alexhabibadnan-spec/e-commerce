import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiSearch, FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import { useCart } from "../../context/CartContext.jsx";
import logo from "../../assets/image/logo.jpeg";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Categories", path: "/categories" }, 
  // { name: "About", path: "/about" },
  // { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Get real cart count from CartContext
  const { cartCount } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Categories
  const handleCategoriesClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);

    const scrollToCategories = () => {
      const el = document.getElementById("categories");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (location.pathname === "/") {
      // Home 
      scrollToCategories();
    } else {
      navigate("/");
      setTimeout(scrollToCategories, 150);
    }
  };

  const activeClass = ({ isActive }) =>
    isActive
      ? "block text-blue-600 font-semibold"
      : "block text-gray-700 hover:text-blue-600 transition";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-11xl mx-auto h-16 px-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 tracking-wide">
            <img src={logo} alt="logo" className="h-12 w-auto object-contain" />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => {
              // ✅ Categories special button
              if (item.name === "Categories") {
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={handleCategoriesClick}
                    className="text-gray-700 hover:text-blue-600 transition"
                  >
                    {item.name}
                  </button>
                );
              }

              return (
                <NavLink key={item.name} to={item.path} className={activeClass}>
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Search */}
          {/* <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-600 focus:outline-none"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-500" />
            </div>
          </div> */}

          {/* Right Icons */}
          <div className="flex items-center gap-5 text-2xl">

            {/* Mobile Search */}
            <button type="button" className="md:hidden hover:text-blue-600 transition">
              <FiSearch />
            </button>


            {/* Cart */}
            <Link to="/cart" className="relative hover:text-blue-600 transition">
              <FiShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link to="/login" className="hidden md:flex hover:text-blue-600 transition">
              <FiUser />
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden hover:text-blue-600 transition"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-[700px] border-t border-gray-200" : "max-h-0"
          }`}
        >
          <div className="bg-white px-5 py-5 flex flex-col gap-4">

            {/* Main Navigation Links */}
            {navLinks.map((item) => {
              // ✅ Categories
              if (item.name === "Categories") {
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={handleCategoriesClick}
                    className="block w-full py-2 text-left text-gray-700 hover:text-blue-600 transition"
                  >
                    {item.name}
                  </button>
                );
              }

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block w-full py-2 ${
                      isActive
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                    } transition`
                  }
                >
                  {item.name}
                </NavLink>
              );
            })}

            {/* Divider */}
            <hr className="w-full border-gray-200" />


            {/* Cart */}
            <NavLink
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="block w-full py-2 text-gray-700 hover:text-blue-600 transition"
            >
              Cart
            </NavLink>

            {/* Orders */}
            <NavLink
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className="block w-full py-2 text-gray-700 hover:text-blue-600 transition"
            >
              My Orders
            </NavLink>

            {/* Login */}
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block w-full bg-blue-600 text-white rounded-lg text-center py-2 hover:bg-blue-700 transition"
            >
              Login
            </NavLink>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;