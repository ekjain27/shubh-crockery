import { Route, Routes } from "react-router-dom";
import { StoreLayout } from "../layouts/StoreLayout";
import { Home } from "../pages/Home";
import { Shop } from "../pages/Shop";
import { GroupIndex, GroupDetail } from "../pages/Groups";
import { ProductDetail } from "../pages/ProductDetail";
import { Cart } from "../pages/Cart";
import { About, Contact } from "../pages/Info";
import { NotFound } from "../pages/NotFound";
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="categories" element={<GroupIndex field="category" />} />
        <Route
          path="category/:slug"
          element={<GroupDetail field="category" />}
        />
        <Route path="brands" element={<GroupIndex field="brand" />} />
        <Route path="brand/:slug" element={<GroupDetail field="brand" />} />
        <Route path="product/:slug" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
