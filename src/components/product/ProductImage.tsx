import { useState } from "react";
import type { ProductImage as Image } from "../../types/product";
import { Icon } from "../common/Icon";
export function ProductImage({
  image,
  eager = false,
}: {
  image?: Image;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return image && !failed ? (
    <img
      src={image.src}
      alt={image.alt}
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailed(true)}
    />
  ) : (
    <div
      className="image-fallback"
      role="img"
      aria-label="Product image not yet available"
    >
      <Icon name="cup" size={60} />
      <span>Image coming soon</span>
    </div>
  );
}
