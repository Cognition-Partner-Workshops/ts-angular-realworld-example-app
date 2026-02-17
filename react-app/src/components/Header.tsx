import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/" data-testid="header-logo">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink className="nav-link" to="/" end>
              Home
            </NavLink>
          </li>
          {!isAuthenticated ? (
            <>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/login"
                  data-testid="header-sign-in"
                >
                  Sign in
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/register"
                  data-testid="header-sign-up"
                >
                  Sign up
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/editor"
                  data-testid="header-new-article"
                >
                  <i className="ion-compose" />&nbsp;New Article
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/settings"
                  data-testid="header-settings"
                >
                  <i className="ion-gear-a" />&nbsp;Settings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to={`/profile/${user?.username ?? ""}`}
                  data-testid="header-profile"
                >
                  {user?.image && (
                    <img
                      src={user.image}
                      className="user-pic"
                      alt={user.username}
                    />
                  )}
                  {user?.username}
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
