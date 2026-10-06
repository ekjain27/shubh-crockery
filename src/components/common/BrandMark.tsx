import { business } from "../../config/business";
import { Icon } from "./Icon";
export function BrandMark() {
  const words = business.businessName.split(" ");
  return (
    <>
      <span className="brand-icon">
        <Icon name="cup" size={29} />
      </span>
      <span>
        {words.slice(0, -1).join(" ").toUpperCase()}
        <span className="wordmark-sub">{words.at(-1)?.toUpperCase()}</span>
      </span>
    </>
  );
}
