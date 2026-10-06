import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { useCart } from "../../hooks/CartContext";
import { useState } from "react";
import { ProductImage } from "./ProductImage";
import { productMessage, whatsappUrl } from "../../utils/whatsapp";
export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const selectable = product.variants.length > 1;
  return (
    <article className="product-card">
      <Link
        className="product-picture"
        to={`/product/${product.slug}`}
        aria-label={`View ${product.name}`}
      >
        <ProductImage image={product.images[0]} />
        {product.dataStatus === "demo" && (
          <span className="demo-badge">DEMO</span>
        )}
      </Link>
      <div className="product-copy">
        <p className="eyebrow">{product.brand ?? product.category}</p>
        <h3>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-meta">
          {product.category}
          {product.capacity
            ? ` · ${product.capacity}`
            : product.variants.length
              ? ` · ${product.variants.length} variants`
              : ""}
        </p>
        <a
          className="price-enquiry"
          href={whatsappUrl(productMessage(product))}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ask Price on WhatsApp →
        </a>
        <div className="card-actions">
          <Link to={`/product/${product.slug}`}>View Product</Link>
          {selectable ? (
            <Link
              className="button button-small button-outline"
              to={`/product/${product.slug}`}
            >
              Choose variant
            </Link>
          ) : (
            <button
              className="button button-small button-outline"
              disabled={product.availability === "unavailable"}
              onClick={() => {
                add({
                  productId: product.id,
                  variantId: product.variants[0]?.id,
                  quantity: 1,
                });
                setAdded(true);
              }}
            >
              {product.availability === "unavailable"
                ? "Unavailable"
                : added
                  ? "Added ✓"
                  : "Add to Cart"}
            </button>
          )}
        </div>
        <span className="sr-only" role="status">
          {added ? `${product.name} added to cart` : ""}
        </span>
      </div>
    </article>
  );
}
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
