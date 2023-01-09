import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages";
import { Feed } from "./pages/feed";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </BrowserRouter>
  );
}
