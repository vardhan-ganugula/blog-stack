import React, { useEffect } from "react";
import ThemeToggler from "../components/ThemeToggle";
import { APP_TITLE } from "../constants/config";
import { FaArrowRightLong } from "react-icons/fa6";
import { dashboardLinks, navLinks as loggOutLinks } from "../constants/navlinks";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const { user, isLoading } = useSelector((state) => state.auth);
  const navLinks = user ? dashboardLinks : loggOutLinks;
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  useEffect(() => {
    window.addEventListener("scroll", (e) => {
      const val = window.scrollY;
      if (val > 0) {
        document.querySelector(".header").classList.add("header__scrolled");
      } else {
        document.querySelector(".header").classList.remove("header__scrolled");
      }
    });
  }, []);

  return (
    <header className="header">
      <nav>
        <div>
          <a href="/" className="header__logo">
            {APP_TITLE}
          </a>
        </div>
        <div className="header__nav-container">
          <ul className="header__nav">
            {navLinks.map((link, index) => {
              return (
                <li key={index}>
                  <NavLink to={link.link}> {link.name}</NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="header__actions">
           <ThemeToggler />
          {isLoading ? (
            <div
              className="loading__spinner"
              style={{
                rotate: "360deg",
                animation: "spin 1s linear infinite",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AiOutlineLoading3Quarters size={25} />
            </div>
          ) : user ? (
            <div className="user__profile">
              <NavLink to="/profile"  
              className="header__link header__profile__link"
              >
                <img
                  src={user.profilePicture}
                  alt="profile"
                  style={{
                    height: "40px",
                    width: "40px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "1px solid var(--text-color)",
                    padding: "5px",
                  }}
                />
                <span>{user.username}</span>
              </NavLink>
            </div>
          ) : (
            <>
             
              <div className="header__action_links">
                <NavLink to="/login" className="header__link">
                  login
                </NavLink>
              </div>
            </>
          )}
          {/* mobile navigation */}

          <div className="mobile__nav" onClick={toggleMobileNav}>
            <svg
              width="30"
              height="24"
              viewBox="0 0 50 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="5"
                fill="white"
                style={{
                  transform: isMobileNavOpen ? "rotate(45deg)" : "rotate(0deg)",
                  transformOrigin: "left top",
                }}
              />
              <rect
                x="3"
                y="28"
                fill="white"
                className={`${isMobileNavOpen ? "mobile__nav__checked" : ""}`}
              />
              <rect
                x="3"
                y="50"
                fill="white"
                style={{
                  transform: isMobileNavOpen
                    ? "rotate(-45deg)"
                    : "rotate(0deg)",
                  transformOrigin: "left bottom",
                }}
              />
            </svg>
          </div>
        </div>
        <div
          className={`mobile__nav__container ${
            isMobileNavOpen ? "mobile__nav__open" : ""
          }`}
        >
          <ul className="mobile__nav__links">
            {navLinks.map((ele, index) => {
              return (
                <li key={index}>
                  <NavLink to={ele.link}>
                    <span>{ele.name}</span>
                    <span className="mobile__nav__link__arrow">
                      <FaArrowRightLong size={25} />
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
          <div className="bottom__mobile__links">
            <div className="btn__container">
              <NavLink href="/login">Login</NavLink>
            </div>
            <div className="btn__container">
              <NavLink href="/login">SignUp</NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
