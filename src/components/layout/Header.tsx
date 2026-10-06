import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { business } from "../../config/business";
import { useCart } from "../../hooks/CartContext";
import { Icon } from "../common/Icon";
import { BrandMark } from "../common/BrandMark";
export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab") {
        const links = menu.current?.querySelectorAll<HTMLAnchorElement>("a");
        if (!links?.length) return;
        const first = links[0],
          last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          toggle.current?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          toggle.current?.focus();
        } else if (document.activeElement === toggle.current) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
    };
    const resize = () => {
      if (window.matchMedia("(min-width: 801px)").matches) {
        setOpen(false);
        document.getElementById("main")?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("resize", resize);
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handler);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  const links = ["Shop", "Categories", "Brands", "About", "Contact"];
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="top-bar">
        A little more warmth for your everyday.{" "}
        <span>Enquire & order on WhatsApp →</span>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link
            to="/"
            className="wordmark"
            aria-label={`${business.businessName} home`}
          >
            <BrandMark />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((label) => (
              <NavLink key={label} to={`/${label.toLowerCase()}`}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="header-tools">
            <Link to="/shop" className="icon-link" aria-label="Search products">
              <Icon name="search" />
            </Link>
            <Link
              to="/cart"
              className="icon-link cart-link"
              aria-label={`Cart, ${count} items`}
            >
              <Icon name="bag" />
              <span className="cart-count">{count}</span>
            </Link>
            <button
              ref={toggle}
              className="icon-link menu-toggle"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(!open)}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
        {open && (
          <nav
            ref={menu}
            id="mobile-menu"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {links.map((label) => (
              <NavLink
                key={label}
                to={`/${label.toLowerCase()}`}
                onClick={() => toggle.current?.focus()}
              >
                {label}
                <Icon name="arrow" />
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <div className="search-strip">
        <form
          className="container header-search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
          }}
        >
          <Icon name="search" size={18} />
          <label className="sr-only" htmlFor="header-search">
            Search the collection
          </label>
          <input
            id="header-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find something for your home…"
          />
          <button type="submit">
            Search <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>
    </>
  );
}
