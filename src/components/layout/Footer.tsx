import { Link } from "react-router-dom";
import { business } from "../../config/business";
import { generalEnquiryUrl } from "../../utils/whatsapp";
import { Icon } from "../common/Icon";
import { BrandMark } from "../common/BrandMark";
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="wordmark">
            <BrandMark />
          </Link>
          <p>
            Thoughtful essentials for your kitchen,
            <br />
            your table, and your everyday.
          </p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link to="/shop">All products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/brands">Brands</Link>
        </div>
        <div>
          <h2>Shubh Crockery</h2>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/cart">Your enquiry cart</Link>
        </div>
        <div>
          <h2>Let’s talk</h2>
          <p>Ask us about prices & availability.</p>
          <a
            className="footer-whatsapp"
            href={generalEnquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="chat" /> {business.whatsappDisplay} →
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {business.businessName}
        </span>
        <span>Browse. Add to cart. Enquire on WhatsApp.</span>
      </div>
    </footer>
  );
}
