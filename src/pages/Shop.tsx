import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "../data/products";
import { deriveGroups, filterProducts } from "../utils/products";
import { ProductGrid } from "../components/product/ProductCard";
export function Shop() {
  const [params, setParams] = useSearchParams();
  // Router updates can render asynchronously. Preserve the latest requested
  // filters so a quick change after clearing cannot resurrect stale filters.
  const pendingParams = useRef(params);
  useEffect(() => {
    pendingParams.current = params;
  }, [params]);
  const commit = (next: URLSearchParams) => {
    pendingParams.current = next;
    setParams(next, { replace: true });
  };
  const clear = () => commit(new URLSearchParams());
  const query = params.get("q") ?? "",
    category = params.get("category") ?? "",
    brand = params.get("brand") ?? "";
  const filtered = filterProducts(products, { query, category, brand });
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(pendingParams.current);
    if (value) next.set(key, value);
    else next.delete(key);
    commit(next);
  };
  return (
    <div className="container page">
      <p className="eyebrow">THE DEMO COLLECTION</p>
      <h1>Something for your everyday.</h1>
      <p className="page-intro">
        Browse crockery, serveware and home essentials. Ask us for prices on
        WhatsApp.
      </p>
      <div className="filters">
        <div className="field search-field">
          <label htmlFor="shop-search">Search products</label>
          <input
            id="shop-search"
            type="search"
            placeholder="Try ‘mug’ or ‘bottle’"
            value={query}
            onChange={(e) => update("q", e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">All categories</option>
            {deriveGroups("category").map((group) => (
              <option key={group.slug}>{group.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="brand-filter">Brand</label>
          <select
            id="brand-filter"
            value={brand}
            onChange={(e) => update("brand", e.target.value)}
          >
            <option value="">All brands</option>
            {deriveGroups("brand").map((group) => (
              <option key={group.slug}>{group.name}</option>
            ))}
          </select>
        </div>
        <button className="clear-filters" onClick={clear}>
          Clear filters
        </button>
      </div>
      <p className="result-count" role="status">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
        {query ? ` matching “${query}”` : ""}
      </p>
      {filtered.length ? (
        <ProductGrid products={filtered} />
      ) : (
        <div className="empty">
          <h2>No products found</h2>
          <p>Try another search or clear your filters.</p>
          <button className="button" onClick={clear}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
