/** @jsxImportSource @emotion/react */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./service/firebase";
import TopPage from "./components/TopPage";
import Input from "./components/Input";
import Recipe from "./components/Recipe";
import SearchPage from "./components/SearchPage";

function App() {
  return (
    <BrowserRouter>
      {/* BrowserRouter直下に置けるコンポーネントは1つだけ */}
      <Routes>
        {/* RouteはBrowserRouter以下ならばどこの階層に置いてもよい */}
        <Route path={`/`} element={<TopPage />} />
        <Route path={`/input`} element={<Input />} />
        <Route path={`/recipe/:id`} element={<Recipe />} />
        <Route path={`/search`} element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
