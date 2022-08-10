import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@trussworks/react-uswds";
import { MAIN_ROUTES } from "../AppRoutes";
import Logo from "../atoms/Logo";

const Header = () => {
  const navigate = useNavigate();

  const logoutUser = () => {
    sessionStorage.clear();
    navigate(MAIN_ROUTES.LOGIN);
  };

  const username = sessionStorage.getItem("Username");

  return (
    <header className="usa-header site-header site-header-dark" role="banner">
      <div className="usa-navbar site-header-navbar">
        <div id="logo">
          <Link to={MAIN_ROUTES.HOME}>
            <Logo />
          </Link>
        </div>

        <Link to={MAIN_ROUTES.PROJECTS}>Projects</Link>
        <Link to={MAIN_ROUTES.COMPONENT_LIBRARY}>Component Library</Link>
        <div className="site-header-right">
          <Link to={MAIN_ROUTES.HELP}>Help</Link>
          {username && (
            <Button className="site-header-dark" onClick={logoutUser}>
              {username}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
