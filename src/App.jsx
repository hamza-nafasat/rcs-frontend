import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import Login from "./pages/auth/Login";
import Singup from "./pages/auth/Singup";
import ForgetPassword from "./pages/auth/ForgetPassword";
import CheckEmail from "./pages/auth/CheckEmail";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
