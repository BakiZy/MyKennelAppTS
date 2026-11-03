import AuthContext from "./store/auth-context";

import { Route, Routes } from "react-router-dom";
import React, { useContext } from "react";
import Navigation from "./components/UI/Navigation";
import About from "./pages/About";
import AboutSr from "./pages/AboutSr";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import NewPoodle from "./pages/NewPoodle";
import Reservation from "./pages/Reservation";
import "bootstrap/dist/css/bootstrap.min.css";
import EditPoodle from "./pages/Edit";
import ImagePage from "./pages/ImageUr";
import Puppies from "./pages/Puppies";
import PuppyDetails from "./pages/PuppyDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ConfirmEmail from "./pages/ConfirmEmail";
import ResendConfirmation from "./pages/ResendConfirmation";

const App: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext.isReady) {
    return <p role="status" style={{ padding: "2rem" }}>Loading account...</p>;
  }

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/o-nama" element={<AboutSr />} />
        <Route path="/puppies" element={<Puppies language="en" />} />
        <Route path="/puppies/:puppyId" element={<PuppyDetails language="en" />} />
        <Route path="/stenci-pudle" element={<Puppies language="sr" />} />
        <Route path="/stenci-pudle/:puppyId" element={<PuppyDetails language="sr" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/resend-confirmation" element={<ResendConfirmation />} />
        {authContext.isLoggedIn ? (
          <Route path="/profile" element={<Profile />} />
        ) : (
          <Route path="/login" element={<LoginPage />} />
        )}
        {authContext.isAdmin ? (
          <Route path="/admin" element={<Admin />} />
        ) : (
          <Route path="*" element={<NotFound />} />
        )}
        {authContext.isAdmin && (
          <Route path="/new-poodle" element={<NewPoodle />} />
        )}
        {authContext.isAdmin && (
          <Route path="/edit-poodle/:poodleId" element={<EditPoodle />} />
        )}
        {authContext.isAdmin && (
          <Route path="/images" element={<ImagePage />} />
        )}
        <Route path="/poodles/:poodleId" element={<Reservation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
