import { Link } from "react-router-dom";
import { business } from "../config/business";
import { products } from "../data/products";
import { deriveGroups } from "../utils/products";
import { generalEnquiryUrl } from "../utils/whatsapp";
import { ProductGrid } from "../components/product/ProductCard";
import { Icon } from "../components/common/Icon";
const categoryImages: Record<string, string> = {
  "Bottles & flasks": "bottle",
  "Dining & crockery": "plates",
  Serveware: "casserole",
  "Kitchen & storage": "container",
};
export function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="small-rule" /> WELCOME TO{" "}
            {business.businessName.toUpperCase()}
          </p>
          <h1>
            Everyday essentials.
            <br />
            <em>A home to love.</em>
          </h1>
          <p>
            From the first cup of tea to a table shared together, discover
            crockery and homeware for your everyday.
          </p>
          <div className="hero-buttons">
            <Link className="button" to="/shop">
              Shop Products <Icon name="arrow" size={18} />
            </Link>
            <a
              className="text-link"
              href={generalEnquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="chat" /> WhatsApp enquiry
            </a>
          </div>
          <div className="hero-note">
            <span>Made for browsing.</span>
            <span>One message away.</span>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="/images/hero.svg"
            alt="Original representative illustration of homeware arranged on a warm kitchen table"
            fetchPriority="high"
          />
          <div className="hero-label">
            <span>THE EVERYDAY COLLECTION</span>
            <strong>Little things. Lovely moments.</strong>
          </div>
          <span className="art-caption">Representative illustration</span>
        </div>
      </section>
      <div className="value-strip container">
        <span>
          <Icon name="cup" /> Crockery & homeware
        </span>
        <span>
          <Icon name="bag" /> Build your enquiry cart
        </span>
        <span>
          <Icon name="chat" /> Ask prices on WhatsApp
        </span>
      </div>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND YOUR EVERYDAY</p>
            <h2>Shop by category</h2>
          </div>
          <Link className="text-link" to="/categories">
            All categories <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="category-grid">
          {deriveGroups("category").map((group, index) => (
            <Link
              className="category-card"
              key={group.slug}
              to={`/category/${group.slug}`}
            >
              <div className={`category-art art-${index}`}>
                <img
                  src={`/images/${categoryImages[group.name]}.svg`}
                  alt=""
                  loading="lazy"
                />
              </div>
              <div>
                <h3>{group.name}</h3>
                <span>
                  {group.count} demo products <Icon name="arrow" size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="section featured-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A FEW THINGS TO EXPLORE</p>
              <h2>Everyday favourites</h2>
            </div>
            <Link className="text-link" to="/shop">
              View all products <Icon name="arrow" size={18} />
            </Link>
          </div>
          <ProductGrid products={products.filter((p) => p.featured)} />
          <p className="section-note">
            Demo collection only. Product details and availability are not yet
            catalogue-verified.
          </p>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE THE COLLECTION</p>
            <h2>Shop by brand</h2>
          </div>
          <Link className="text-link" to="/brands">
            All brands <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="brand-grid">
          {deriveGroups("brand").map((group) => (
            <Link key={group.slug} to={`/brand/${group.slug}`}>
              <span className="eyebrow">SAMPLE BRAND</span>
              <h3>{group.name}</h3>
              <span>
                {group.count} products <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="how-section">
        <div className="container">
          <p className="eyebrow">SIMPLE, PERSONAL SHOPPING</p>
          <h2>
            A little browsing.
            <br />A friendly conversation.
          </h2>
          <div className="steps-grid">
            {[
              [
                "01",
                "Find your favourites",
                "Explore products by category, brand or a quick search.",
              ],
              [
                "02",
                "Build your enquiry",
                "Choose variants and add the things you like to your cart.",
              ],
              [
                "03",
                `Talk to ${business.businessName}`,
                "Send your list on WhatsApp and ask for prices and availability.",
              ],
            ].map(([number, title, text]) => (
              <div key={number}>
                <span className="step-number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="whatsapp-banner">
          <div className="chat-circle">
            <Icon name="chat" size={36} />
          </div>
          <div>
            <p className="eyebrow">WE’RE ONE MESSAGE AWAY</p>
            <h2>Found something you like?</h2>
            <p>Add it to your cart or simply ask us on WhatsApp.</p>
          </div>
          <a
            className="button"
            href={generalEnquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Let’s chat <Icon name="arrow" size={18} />
          </a>
        </div>
      </section>
    </>
  );
}
