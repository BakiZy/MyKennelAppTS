import classes from "./Navigation.module.css";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../src/poodle.svg";
import { aboutPath, accountPath, alternatePath, homePath, languageForPath, puppiesPath } from "../../i18n/siteLanguage";

const Navigation = () => {
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const language = languageForPath(location.pathname);
  const isSerbian = language === "sr";
  const [menuExpanded, setMenuExpanded] = useState(false);

  useEffect(() => {
    setMenuExpanded(false);
  }, [location.key]);

  const logoutHandler = async () => {
    try {
      await authContext.logout();
    } catch {
      window.alert(isSerbian ? "Odjava nije uspela. Pokušajte ponovo." : "Logout failed. Please try again.");
    }
  };

  return (
    <Navbar variant="dark" expand="lg" expanded={menuExpanded} onToggle={setMenuExpanded} className={classes.navMain}>
      <Container fluid="xl" className={classes.navShell}>
        <Navbar.Brand className={classes.logoDivLeft}>
          <img src={logo} alt="Von Apalusso poodle kennel logo" className={classes.logo} />
          <span>© Poodle Kennel Von Apalusso</span>
          <img src={logo} alt="Von Apalusso poodle kennel logo" className={classes.logo} />
        </Navbar.Brand>

        <nav className={classes.languageTabs} aria-label="Language / Jezik">
          <Link to={alternatePath(location.pathname, "sr") + location.search} aria-current={isSerbian ? "page" : undefined} lang="sr">SR</Link>
          <Link to={alternatePath(location.pathname, "en") + location.search} aria-current={!isSerbian ? "page" : undefined} lang="en">EN</Link>
        </nav>

        <Navbar.Toggle aria-controls="main-navigation" />
        <Navbar.Collapse id="main-navigation" className={classes.navCollapse} onClick={() => setMenuExpanded(false)}>
          <Nav className={classes.mainMenu}>
            <Nav.Link as={Link} to={homePath(language)}>
              {isSerbian ? "Početna" : "Home"}
            </Nav.Link>
            {authContext.isLoggedIn ? (
              <Nav.Link as={Link} to={accountPath(language, "profile")}>
                {isSerbian ? "Profil" : "Profile"}
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to={accountPath(language, "login")}>
                {isSerbian ? "Prijava" : "Login"}
              </Nav.Link>
            )}
            <Nav.Link as={Link} to={aboutPath(language)}>
              {isSerbian ? "O nama" : "About"}
            </Nav.Link>
            <Nav.Link as={Link} to={puppiesPath(language)}>
              {isSerbian ? "Štenci" : "Puppies"}
            </Nav.Link>
            {authContext.isAdmin && (
              <Nav.Link as={Link} to="/admin">
                Admin
              </Nav.Link>
            )}
            {authContext.isAdmin && (
              <Nav.Link as={Link} to="/new-poodle">
                New Poodle
              </Nav.Link>
            )}
            {authContext.isAdmin && (
              <Nav.Link as={Link} to="/images">
                Images
              </Nav.Link>
            )}
            {authContext.isLoggedIn && (
              <Nav.Link
                as="button"
                onClick={logoutHandler}
                className={classes.logoutLink}
              >
                {isSerbian ? "Odjava" : "Logout"}
              </Nav.Link>
            )}
          </Nav>

          <Nav className={classes.social}>
            <Nav.Link href="tel:+381646149512" aria-label="WhatsApp">
              <FaWhatsapp className={classes.faWhatsapp} size={30} />
            </Nav.Link>
            <Nav.Link
              href="https://www.facebook.com/milos.petrov.10/photos_by"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook className={classes.faFacebook} size={30} />
            </Nav.Link>
            <Nav.Link
              href="https://www.instagram.com/vonappalusso/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className={classes.faInstagram} size={30} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
