import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Cart from "./components/cart/Cart";

const App = () => {
  return (
    <MainLayout>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Cart */}
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </MainLayout>
  );
};

export default App;