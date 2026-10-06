import { Link } from "react-router-dom";
import { useCart } from "../hooks/CartContext";
import { products } from "../data/products";
import { itemKey } from "../utils/cart";
import { cartMessage, whatsappUrl } from "../utils/whatsapp";
import { ProductImage } from "../components/product/ProductImage";
import { QuantityControl } from "../components/cart/QuantityControl";
import { Icon } from "../components/common/Icon";
export function Cart() {
  const { items, count, update, remove, clear, storageUnavailable } = useCart();
  return (
    <div className="container page">
      <p className="eyebrow">YOUR FAVOURITES, IN ONE PLACE</p>
      <h1>Your enquiry cart</h1>
      <p className="page-intro">
        No payment needed here. Send your list to the shop and ask for prices
        and availability.
      </p>
      {storageUnavailable && (
        <p className="sample-warning" role="status">
          Browser storage is unavailable. Your cart will work for this visit but
          may not persist after refresh.
        </p>
      )}
      {!items.length ? (
        <div className="empty">
          <Icon name="bag" size={52} />
          <h2>Your cart is waiting</h2>
          <p>Find something for your home and add it here.</p>
          <Link className="button" to="/shop">
            Explore products <Icon name="arrow" />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            <div className="cart-list-heading">
              <span>
                {count} {count === 1 ? "item" : "items"}
              </span>
              <button className="text-button" onClick={clear}>
                Clear cart
              </button>
            </div>
            {items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              const variant = product.variants.find(
                (v) => v.id === item.variantId,
              );
              return (
                <article className="cart-row" key={itemKey(item)}>
                  <Link
                    className="cart-image"
                    to={`/product/${product.slug}`}
                    aria-label={`View ${product.name}`}
                  >
                    <ProductImage image={product.images[0]} />
                  </Link>
                  <div className="cart-row-copy">
                    <span className="eyebrow">{product.brand}</span>
                    <h2>
                      <Link to={`/product/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h2>
                    {variant && <p>{variant.label}</p>}
                    <p className="muted">
                      Demo product · Ask Price on WhatsApp
                    </p>
                    <div className="cart-row-actions">
                      <QuantityControl
                        value={item.quantity}
                        onChange={(q) => update(itemKey(item), q)}
                        label={`Quantity for ${product.name}${variant ? ` ${variant.label}` : ""}`}
                      />
                      <button
                        className="text-button"
                        aria-label={`Remove ${product.name}${variant ? ` ${variant.label}` : ""}`}
                        onClick={() => remove(itemKey(item))}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
            <Link className="text-link" to="/shop">
              ← Continue browsing
            </Link>
          </div>
          <aside className="enquiry-summary">
            <p className="eyebrow">THE NEXT STEP</p>
            <h2>Let’s start a conversation.</h2>
            <p>
              Your list contains{" "}
              <strong>
                {count} {count === 1 ? "item" : "items"}
              </strong>
              . The shop will confirm prices and availability on WhatsApp.
            </p>
            <a
              className="button full-width"
              href={whatsappUrl(cartMessage(items))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="chat" /> Send enquiry →
            </a>
            <p className="muted">
              Opens WhatsApp with your product list. Sending an enquiry does not
              confirm an order.
            </p>
            <div className="sample-warning">
              This cart contains demo products. Catalogue products will be added
              in the next milestone.
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
