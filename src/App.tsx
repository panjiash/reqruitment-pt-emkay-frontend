import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProductIndex from "./pages/Product/Index";
import ProductAdd from "./pages/Product/Add";
import ProductUpdate from "./pages/Product/Update";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={"/product"} />} />
          <Route path="/product" element={<ProductIndex />} />
          <Route path="/product/add" element={<ProductAdd />} />
          <Route path="/product/update/:id" element={<ProductUpdate />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
