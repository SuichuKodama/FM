import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './service/firebase';
import TopPage from './components/TopPage';
import Input from './components/Input';
import Recipe from './components/Recipe';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary fallback={<p>error</p>}>
        <BrowserRouter>
          {/* BrowserRouter直下に置けるコンポーネントは1つだけ */}
          <Routes>
            {/* RouteはBrowserRouter以下ならばどこの階層に置いてもよい */}
            <Route path={`/`} element={<TopPage />} />
            <Route path={`/input`} element={<Input />} />
            <Route path={`/recipe/:id`} element={<Recipe />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
