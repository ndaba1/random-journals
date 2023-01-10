import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Index } from "./pages";
import { NotFound } from "./pages/404";
import { CompleteSignIn } from "./pages/finish";
import { Home } from "./pages/home";

export function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route index path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/complete" element={<CompleteSignIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
