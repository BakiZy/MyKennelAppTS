import AuthContext from "./store/auth-context";
// import Layout from "./components/UI/Layout";
import { Route, Routes } from "react-router-dom";
import React, { useContext } from "react";
import Navigation from "./components/UI/Navigation";
import About from "./pages/About";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import NewPoodle from "./pages/NewPoodle";
import Reservation from "./pages/Reservation";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  const authContext = useContext(AuthContext);
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {authContext.isLoggedIn ? (
          <Route path="/profile" element={<Profile />} />
        ) : (
          <Route path="/login" element={<LoginPage />} />
        )}
        {authContext.isAdmin ? (
          <Route path="/admin" element={<Admin />} />
        ) : null}
        {authContext.isAdmin && (
          <Route path="/new-poodle" element={<NewPoodle />} />
        )}
        <Route path=":poodleId" element={<Reservation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
