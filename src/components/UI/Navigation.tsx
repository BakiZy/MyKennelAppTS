import classes from "./Navigation.module.css";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../src/poodle.svg";

const Navigation = () => {
  const authContext = useContext(AuthContext);
  const isSerbian = useLocation().pathname.startsWith("/stenci-pudle");

  const logoutHandler = async () => {
    try {
      await authContext.logout();
    } catch {
      window.alert("Logout failed. Please try again.");
    }
  };

  return (
    <Navbar variant="dark" expand="lg" className={classes.navMain}>
      <Container fluid="xl" className={classes.navShell}>
        <Navbar.Brand className={classes.logoDivLeft}>
          <img src={logo} alt="Von Apalusso poodle kennel logo" className={classes.logo} />
          <span>© Poodle Kennel Von Apalusso</span>
          <img src={logo} alt="Von Apalusso poodle kennel logo" className={classes.logo} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navigation" />
        <Navbar.Collapse id="main-navigation" className={classes.navCollapse}>
          <Nav className={classes.mainMenu}>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {authContext.isLoggedIn ? (
              <Nav.Link as={Link} to="/profile">
                Profile
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
            <Nav.Link as={Link} to={isSerbian ? "/o-nama" : "/about"}>
              {isSerbian ? "O nama" : "About"}
            </Nav.Link>
            <Nav.Link as={Link} to={isSerbian ? "/stenci-pudle" : "/puppies"}>
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
                Logout
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
