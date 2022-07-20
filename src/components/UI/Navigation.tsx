import classes from "./Navigation.module.css";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "file:///F:/Downloads/poodle.svg";

const Navigation = () => {
  const authContext = useContext(AuthContext);

  return (
    <Navbar variant="dark" expand="lg" className={classes.navMain}>
      <Container>
        <Navbar.Brand className={classes.logoDivLeft}>
          <img src={logo} alt="poodle" className={classes.logo} />
          <span
            className="col-sm"
            style={{ color: "rgba(255, 255, 255, 0.75)" }}
          >
            © 2020 Poodle Kennel Von Apalusso{" "}
          </span>
          <img src={logo} alt="poodle" className={classes.logo} />
        </Navbar.Brand>
      </Container>
      <Container className={classes.mainMenu}>
        <Nav className="ml-auto">
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
          <Nav.Link as={Link} to="/about">
            About
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
        </Nav>
      </Container>
      <Nav className={classes.social}>
        <Nav.Link href="tel:+381646149512">
          <FaWhatsapp className={classes.faWhatsapp} size={40} />
        </Nav.Link>
        <Nav.Link
          href="https://www.facebook.com/milos.petrov.10/photos_by"
          target="_blank"
          rel="noreferrer"
        >
          <FaFacebook className={classes.faFacebook} size={40} />
        </Nav.Link>
        <Nav.Link
          href="https://www.instagram.com/vonappalusso/"
          target="_blank"
          rel="noreferrer"
        >
          <FaInstagram className={classes.faInstagram} size={40} />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Navigation;
