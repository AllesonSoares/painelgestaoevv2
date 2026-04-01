import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import AppLayout from "./components/AppLayout";
import Inicio from "./pages/Inicio";
import Carteira from "./pages/Carteira";
import Esteiras from "./pages/Esteiras";
import Perfil from "./pages/Perfil";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/carteira" element={<Carteira />} />
          <Route path="/esteiras" element={<Esteiras />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
