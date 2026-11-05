import AuthContext from "./store/auth-context";

import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import React, { useContext, useLayoutEffect } from "react";
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
import LitterDetails from "./pages/LitterDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ConfirmEmail from "./pages/ConfirmEmail";
import ResendConfirmation from "./pages/ResendConfirmation";
import { languageForPath } from "./i18n/siteLanguage";

const App: React.FC = () => {
  const authContext = useContext(AuthContext);
  const language = languageForPath(useLocation().pathname);

  useLayoutEffect(() => {
    if (authContext.isReady) {
      document.documentElement.classList.remove("seo-app-loading");
    }
  }, [authContext.isReady]);

  if (!authContext.isReady) {
    return <p role="status" style={{ padding: "2rem" }}>{language === "sr" ? "Učitavanje naloga..." : "Loading account..."}</p>;
  }

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home language="en" />} />
        <Route path="/sr" element={<Home language="sr" />} />

        <Route path="/about" element={<About />} />
        <Route path="/o-nama" element={<AboutSr />} />
        <Route path="/puppies" element={<Puppies language="en" />} />
        <Route path="/puppies/:puppyId" element={<PuppyDetails language="en" />} />
        <Route path="/puppies/litters/:litterId" element={<LitterDetails language="en" />} />
        <Route path="/stenci-pudle" element={<Puppies language="sr" />} />
        <Route path="/stenci-pudle/:puppyId" element={<PuppyDetails language="sr" />} />
        <Route path="/stenci-pudle/legla/:litterId" element={<LitterDetails language="sr" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/sr/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/sr/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/sr/confirm-email" element={<ConfirmEmail />} />
        <Route path="/resend-confirmation" element={<ResendConfirmation />} />
        <Route path="/sr/resend-confirmation" element={<ResendConfirmation />} />
        <Route path="/profile" element={authContext.isLoggedIn ? <Profile language="en" /> : <Navigate to="/login" replace />} />
        <Route path="/sr/profile" element={authContext.isLoggedIn ? <Profile language="sr" /> : <Navigate to="/sr/login" replace />} />
        <Route path="/login" element={authContext.isLoggedIn ? <Navigate to="/profile" replace /> : <LoginPage language="en" />} />
        <Route path="/sr/login" element={authContext.isLoggedIn ? <Navigate to="/sr/profile" replace /> : <LoginPage language="sr" />} />
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
        <Route path="/poodles/:poodleId" element={<Reservation language="en" />} />
        <Route path="/sr/poodles/:poodleId" element={<Reservation language="sr" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
