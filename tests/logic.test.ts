import { describe, expect, it } from "vitest";
import { products } from "../src/data/products";
import {
  filterProducts,
  findProduct,
  deriveGroups,
  slugify,
} from "../src/utils/products";
import {
  addItem,
  itemKey,
  updateQuantity,
  removeItem,
  serializeCart,
  deserializeCart,
  readCart,
  saveCart,
  MAX_QUANTITY,
} from "../src/utils/cart";
import {
  productMessage,
  cartMessage,
  whatsappUrl,
} from "../src/utils/whatsapp";
const bottle = products[0],
  plate = products[1];
const sand = {
  productId: bottle.id,
  variantId: bottle.variants[0].id,
  quantity: 1,
};
const sage = { ...sand, variantId: bottle.variants[1].id };
const plateItem = { productId: plate.id, quantity: 2 };
describe("product catalogue foundation", () => {
  it("searches case-insensitively across words and trims whitespace", () => {
    expect(filterProducts(products, { query: "  EVERYday   bottle " })).toEqual(
      [bottle],
    );
  });
  it("combines search, category and brand filters", () => {
    expect(
      filterProducts(products, {
        query: "tea",
        category: "Dining & crockery",
        brand: "Demo Table",
      }).map((p) => p.id),
    ).toEqual(["demo-mug"]);
    expect(
      filterProducts(products, { query: "tea", brand: "Demo Kitchen" }),
    ).toEqual([]);
  });
  it("returns all products when filters are cleared and none for unknown terms", () => {
    expect(filterProducts(products, {})).toHaveLength(6);
    expect(filterProducts(products, { query: "nonexistent" })).toEqual([]);
  });
  it("looks up products safely with invalid or missing slugs", () => {
    expect(findProduct(bottle.slug)).toBe(bottle);
    expect(findProduct("missing")).toBeUndefined();
    expect(findProduct(undefined)).toBeUndefined();
  });
  it("derives unique categories and brands with accurate counts", () => {
    expect(deriveGroups("category")).toHaveLength(4);
    expect(deriveGroups("brand")).toHaveLength(3);
    expect(
      deriveGroups("category").find((g) => g.name === "Dining & crockery")
        ?.count,
    ).toBe(2);
    expect(slugify("Bottles & flasks")).toBe("bottles-flasks");
  });
  it("handles empty catalogues and missing optional brands", () => {
    expect(deriveGroups("brand", [])).toEqual([]);
    expect(deriveGroups("category", [])).toEqual([]);
    expect(deriveGroups("brand", [{ ...bottle, brand: undefined }])).toEqual(
      [],
    );
  });
});
describe("variant-aware cart", () => {
  it("adds valid products", () => {
    expect(addItem([], plateItem)).toEqual([plateItem]);
  });
  it("merges duplicate product and variant", () => {
    expect(addItem([sand], { ...sand, quantity: 2 })).toEqual([
      { ...sand, quantity: 3 },
    ]);
  });
  it("keeps different variants separate", () => {
    expect(addItem([sand], sage)).toEqual([sand, sage]);
  });
  it("requires a valid variant and ignores unknown products", () => {
    expect(addItem([], { productId: bottle.id, quantity: 1 })).toEqual([]);
    expect(addItem([], { ...sand, variantId: "missing" })).toEqual([]);
    expect(addItem([], { productId: "missing", quantity: 1 })).toEqual([]);
  });
  it("updates quantities with a minimum of 1 and maximum of 99", () => {
    expect(updateQuantity([sand], itemKey(sand), 0)[0].quantity).toBe(1);
    expect(updateQuantity([sand], itemKey(sand), 5)[0].quantity).toBe(5);
    expect(updateQuantity([sand], itemKey(sand), Infinity)[0].quantity).toBe(1);
    expect(updateQuantity([sand], itemKey(sand), 1000)[0].quantity).toBe(
      MAX_QUANTITY,
    );
  });
  it("removes only the matching variant", () => {
    expect(removeItem([sand, sage], itemKey(sand))).toEqual([sage]);
  });
  it("serializes and deserializes products and variants", () => {
    expect(deserializeCart(serializeCart([sand, sage, plateItem]))).toEqual([
      sand,
      sage,
      plateItem,
    ]);
  });
  it("recovers from malformed and unsupported storage", () => {
    for (const raw of [
      null,
      "{bad",
      "null",
      "[]",
      '{"version":2,"items":[]}',
      '{"version":1,"items":"bad"}',
    ])
      expect(deserializeCart(raw)).toEqual([]);
  });
  it("drops obsolete products, invalid variants and invalid quantities", () => {
    const entries = [
      sand,
      { ...sand, productId: "old" },
      { ...sage, variantId: "old" },
      { ...sage, quantity: 0 },
      { ...sage, quantity: "3" },
      { ...sage, quantity: -2 },
      { ...plateItem, variantId: "bad" },
      null,
    ];
    expect(
      deserializeCart(JSON.stringify({ version: 1, items: entries })),
    ).toEqual([sand]);
  });
  it("merges duplicate persisted lines and normalizes oversized quantities", () => {
    expect(
      deserializeCart(
        serializeCart([
          sand,
          { ...sand, quantity: 2 },
          { ...sage, quantity: 999 },
        ]),
      ),
    ).toEqual([
      { ...sand, quantity: 3 },
      { ...sage, quantity: 99 },
    ]);
  });
  it("drops products marked unavailable after a catalogue update", () => {
    expect(
      deserializeCart(serializeCart([sand]), [
        { ...bottle, availability: "unavailable" },
      ]),
    ).toEqual([]);
  });
  it("handles browser storage access errors without crashing", () => {
    expect(
      readCart({
        getItem() {
          throw new Error("blocked");
        },
      }),
    ).toEqual([]);
    expect(
      saveCart(
        {
          setItem() {
            throw new Error("quota");
          },
        },
        [sand],
      ),
    ).toBe(false);
  });
  it("writes the storage schema and reads it back", () => {
    let raw = "";
    const storage = {
      setItem(_key: string, value: string) {
        raw = value;
      },
      getItem() {
        return raw;
      },
    };
    expect(saveCart(storage, [sand])).toBe(true);
    expect(readCart(storage)).toEqual([sand]);
  });
});
describe("WhatsApp enquiries", () => {
  it("includes product, selected variant and quantity without fake prices", () => {
    const message = productMessage(bottle, bottle.variants[0], 3);
    expect(message).toContain("Hello Shubh Crockery");
    expect(message).toContain(bottle.name);
    expect(message).toContain(bottle.variants[0].label);
    expect(message).toContain("Quantity: 3");
    expect(message).toContain("Development sample");
    expect(message).not.toContain("₹");
  });
  it("omits absent variant details and labels verified products correctly", () => {
    expect(productMessage({ ...plate, dataStatus: "verified" })).not.toContain(
      "Development sample",
    );
    expect(productMessage(plate)).not.toContain("Variant:");
  });
  it("builds a cart enquiry with separate variants and no totals", () => {
    const message = cartMessage([sand, sage, plateItem]);
    expect(message).toContain(
      sand.variantId === bottle.variants[0].id ? bottle.variants[0].label : "",
    );
    expect(message).toContain(bottle.variants[1].label);
    expect(message).toContain("Quantity: 2");
    expect(message).toContain("not a confirmed order");
    expect(message).not.toContain("₹");
  });
  it("encodes punctuation, Unicode and newlines and uses the correct destination", () => {
    const message = "Tea & lunch?\nनमस्ते #1 + 2";
    const url = whatsappUrl(message);
    expect(url).toContain("https://wa.me/918439961389?text=");
    expect(new URL(url).searchParams.get("text")).toBe(message);
    expect(url).toContain("%26");
    expect(url).toContain("%0A");
  });
  it("rejects invalid phone destinations", () => {
    expect(() => whatsappUrl("hello", "abc")).toThrow(
      "Invalid WhatsApp number",
    );
  });
});
