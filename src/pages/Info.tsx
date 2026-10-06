import { Link } from "react-router-dom";
import { business } from "../config/business";
import { generalEnquiryUrl } from "../utils/whatsapp";
import { Icon } from "../components/common/Icon";
export function About() {
  return (
    <div className="container page info-page">
      <p className="eyebrow">{business.businessName.toUpperCase()}</p>
      <h1>
        For the everyday
        <br />
        <em>at home.</em>
      </h1>
      <div className="info-grid">
        <div className="info-illustration">
          <img
            src="/images/hero.svg"
            alt="Representative homeware illustration"
          />
          <span className="image-caption">Original illustrative artwork</span>
        </div>
        <div>
          <h2>Crockery, homeware & a conversation.</h2>
          <p>
            {business.businessName} is a retail shop for crockery and
            homeware-related products. This website brings product browsing and
            enquiries together in one place.
          </p>
          <p>
            Explore the collection, choose your favourites and build a cart.
            Send your list through WhatsApp to ask the shop about prices and
            availability.
          </p>
          <p className="sample-warning">
            You’re viewing our development collection. Demo products will be
            replaced or expanded with verified catalogue data.
          </p>
          <Link className="button" to="/shop">
            Explore the collection <Icon name="arrow" />
          </Link>
        </div>
      </div>
    </div>
  );
}
export function Contact() {
  return (
    <div className="container page info-page">
      <p className="eyebrow">LET’S TALK</p>
      <h1>One message away.</h1>
      <p className="page-intro">
        Have a product in mind? Ask us about prices, variants and availability.
      </p>
      <div className="contact-panel">
        <div className="chat-circle">
          <Icon name="chat" size={36} />
        </div>
        <h2>Contact {business.businessName}</h2>
        <p>WhatsApp is our confirmed contact channel.</p>
        <p className="contact-number">{business.whatsappDisplay}</p>
        <a
          className="button"
          href={generalEnquiryUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire on WhatsApp →
        </a>
        {business.phone && <p>Phone: {business.phone}</p>}
        {business.address && <p>{business.address}</p>}
        {business.email && (
          <a href={`mailto:${business.email}`}>{business.email}</a>
        )}
        {business.openingHours && <p>{business.openingHours}</p>}
        {business.socialLinks.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
