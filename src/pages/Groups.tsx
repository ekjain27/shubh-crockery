import { Link, useParams } from "react-router-dom";
import { deriveGroups } from "../utils/products";
import { products } from "../data/products";
import { ProductGrid } from "../components/product/ProductCard";
import { NotFound } from "./NotFound";
export function GroupIndex({ field }: { field: "category" | "brand" }) {
  const label = field === "category" ? "Categories" : "Brands";
  return (
    <div className="container page">
      <p className="eyebrow">EXPLORE AT YOUR OWN PACE</p>
      <h1>{label}</h1>
      <p className="page-intro">
        A small demo collection to help you find your way around.
      </p>
      <div className="group-index">
        {deriveGroups(field).map((group) => (
          <Link key={group.slug} to={`/${field}/${group.slug}`}>
            <span className="eyebrow">
              {field === "brand" ? "SAMPLE BRAND" : "DEVELOPMENT CATEGORY"}
            </span>
            <h2>{group.name}</h2>
            <p>
              {group.count} demo products <span aria-hidden="true">→</span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
export function GroupDetail({ field }: { field: "category" | "brand" }) {
  const { slug } = useParams();
  const group = deriveGroups(field).find((g) => g.slug === slug);
  if (!group)
    return (
      <NotFound
        title={`${field === "category" ? "Category" : "Brand"} not found`}
        message="This collection is not available. Explore the current demo collection instead."
      />
    );
  const list = products.filter((p) => p[field] === group.name);
  return (
    <div className="container page">
      <Link
        className="breadcrumb"
        to={field === "category" ? "/categories" : "/brands"}
      >
        ← All {field === "category" ? "categories" : "brands"}
      </Link>
      <p className="eyebrow">DEMO COLLECTION</p>
      <h1>{group.name}</h1>
      <p className="result-count">{list.length} products</p>
      {list.length ? (
        <ProductGrid products={list} />
      ) : (
        <div className="empty">
          <h2>Products coming soon</h2>
          <Link className="button" to="/shop">
            Explore all products
          </Link>
        </div>
      )}
    </div>
  );
}
