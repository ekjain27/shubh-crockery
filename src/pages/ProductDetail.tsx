import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { findProduct, slugify } from "../utils/products";
import { useCart } from "../hooks/CartContext";
import { ProductImage } from "../components/product/ProductImage";
import { QuantityControl } from "../components/cart/QuantityControl";
import { NotFound } from "./NotFound";
import { productMessage, whatsappUrl } from "../utils/whatsapp";
import type { Product } from "../types/product";
export function ProductDetail() {
  const { slug } = useParams();
  const product = findProduct(slug);
  return product ? (
    <Detail key={product.id} product={product} />
  ) : (
    <NotFound
      title="Product not found"
      message="This product may have moved or is not in our collection yet."
    />
  );
}
function Detail({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(
    product.variants.length === 1 ? product.variants[0].id : "",
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const { add } = useCart();
  const variant = product.variants.find((v) => v.id === variantId);
  const needsVariant = product.variants.length > 0 && !variant;
  const unavailable =
    product.availability === "unavailable" ||
    variant?.availability === "unavailable";
  return (
    <div className="container page">
      <div className="breadcrumb">
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/category/${slugify(product.category)}`}>
          {product.category}
        </Link>
      </div>
      <div className="product-detail">
        <div>
          <div className="detail-image">
            <ProductImage
              key={imageIndex}
              image={product.images[imageIndex]}
              eager
            />
            {product.dataStatus === "demo" && (
              <span className="demo-badge">DEMO PRODUCT</span>
            )}
          </div>
          {product.images[imageIndex]?.isRepresentative && (
            <p className="image-caption">
              Representative illustration — not an exact product photograph.
            </p>
          )}
          {product.images.length > 1 && (
            <div className="gallery-thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={image.src}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={imageIndex === index}
                  onClick={() => setImageIndex(index)}
                >
                  <img src={image.src} alt={image.alt} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{product.brand ?? product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-description">{product.shortDescription}</p>
          <p className="detail-price">Ask Price on WhatsApp</p>
          <p className="muted">
            Please enquire for current pricing and availability.
          </p>
          {product.dataStatus === "demo" && (
            <p className="sample-warning">
              Development sample. This product has not been verified against a
              catalogue.
            </p>
          )}
          {product.variants.length > 0 && (
            <fieldset className="variant-field">
              <legend>
                Choose a variant {needsVariant && <span>(required)</span>}
              </legend>
              <div className="variant-options">
                {product.variants.map((v) => (
                  <label
                    key={v.id}
                    className={variantId === v.id ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name="variant"
                      value={v.id}
                      checked={variantId === v.id}
                      disabled={v.availability === "unavailable"}
                      onChange={() => {
                        setVariantId(v.id);
                        setAdded(false);
                      }}
                    />
                    {v.label}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <div className="detail-quantity">
            <span>Quantity</span>
            <QuantityControl
              value={quantity}
              onChange={(q) => {
                setQuantity(q);
                setAdded(false);
              }}
            />
          </div>
          <button
            className="button full-width"
            disabled={needsVariant || unavailable}
            onClick={() => {
              add({ productId: product.id, variantId: variant?.id, quantity });
              setAdded(true);
            }}
          >
            {unavailable
              ? "Currently unavailable"
              : added
                ? "Added to Cart ✓"
                : "Add to Cart"}
          </button>
          <p className="add-status" role="status">
            {added ? (
              <Link to="/cart">View your enquiry cart →</Link>
            ) : needsVariant ? (
              "Select a variant to add this product."
            ) : (
              ""
            )}
          </p>
          <a
            className="button button-whatsapp full-width"
            aria-disabled={needsVariant}
            href={
              needsVariant
                ? undefined
                : whatsappUrl(productMessage(product, variant, quantity))
            }
            onClick={(e) => {
              if (needsVariant) e.preventDefault();
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask on WhatsApp →
          </a>
          <div className="product-specs">
            <h2>Product details</h2>
            {product.description && <p>{product.description}</p>}
            <dl>
              <dt>Category</dt>
              <dd>{product.category}</dd>
              {product.modelCode && (
                <>
                  <dt>Model / SKU</dt>
                  <dd>{product.modelCode}</dd>
                </>
              )}
              {(variant?.capacity || product.capacity) && (
                <>
                  <dt>Capacity</dt>
                  <dd>{variant?.capacity ?? product.capacity}</dd>
                </>
              )}
              {(variant?.size || product.size) && (
                <>
                  <dt>Size</dt>
                  <dd>{variant?.size ?? product.size}</dd>
                </>
              )}
              {variant?.color && (
                <>
                  <dt>Colour</dt>
                  <dd>{variant.color}</dd>
                </>
              )}
              {product.catalogueSource && (
                <>
                  <dt>Catalogue reference</dt>
                  <dd>
                    {product.catalogueSource.fileName}
                    {product.catalogueSource.page
                      ? ` · Page ${product.catalogueSource.page}`
                      : ""}
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
