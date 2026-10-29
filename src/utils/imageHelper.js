import cloth1 from "../assets/cloth1.png";
import cloth2 from "../assets/cloth2.png";
import cloth3 from "../assets/cloth3.png";
import cloth4 from "../assets/cloth4.png";
import cloth5 from "../assets/cloth5.png";
import cloth6 from "../assets/cloth6.png";
import cloth7 from "../assets/cloth7.png";
import cloth8 from "../assets/cloth8.png";
import cloth9 from "../assets/cloth9.png";
import cloth10 from "../assets/cloth10.png";
import cloth11 from "../assets/cloth11.png";
import cloth12 from "../assets/cloth12.png";

const localAssetMap = {
  cloth1, cloth2, cloth3, cloth4,
  cloth5, cloth6, cloth7, cloth8,
  cloth9, cloth10, cloth11, cloth12,
  "cloth1.png": cloth1, "cloth2.png": cloth2, "cloth3.png": cloth3, "cloth4.png": cloth4,
  "cloth5.png": cloth5, "cloth6.png": cloth6, "cloth7.png": cloth7, "cloth8.png": cloth8,
  "cloth9.png": cloth9, "cloth10.png": cloth10, "cloth11.png": cloth11, "cloth12.png": cloth12,
};

export const getProductImage = (image) => {
  if (!image || typeof image !== "string") {
    return cloth1;
  }

  const trimmed = image.trim();

  // Agar purana placeholder ya invalid string ho toh default cloth1 return kare
  if (
    trimmed.includes("placeholder.com") ||
    trimmed.includes("default-product.svg") ||
    trimmed === "undefined" ||
    trimmed === "null" ||
    trimmed === ""
  ) {
    return cloth1;
  }

  // 1. Direct Web Link, Cloudinary URL, ya Base64
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // 2. Cloth name direct map
  const cleanKey = trimmed.replace(/^\/products\//, "").replace(/^\/assets\//, "");
  if (localAssetMap[cleanKey]) {
    return localAssetMap[cleanKey];
  }
  if (localAssetMap[trimmed]) {
    return localAssetMap[trimmed];
  }

  // 3. Root slash path (/products/... ya /assets/...)
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // 4. Cloth name format
  if (trimmed.startsWith("cloth")) {
    const filename = trimmed.endsWith(".png") ? trimmed : `${trimmed}.png`;
    return localAssetMap[trimmed] || `/products/${filename}`;
  }

  return `/products/${trimmed}`;
};
