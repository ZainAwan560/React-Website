import { useState, useEffect, useCallback } from "react";
import "./ProductSection.css";
import ProductCard from "../ProductCard/ProductCard";
import { API_BASE_URL } from "../../config/api";
import { getProductImage } from "../../utils/imageHelper";
import { defaultProducts } from "../../data/defaultProducts";

const ProductSection = () => {
  const [products, setProducts] = useState(() => defaultProducts.slice(0, 8));
  const [showAll, setShowAll] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) return;
      const data = await response.json();

      if (Array.isArray(data)) {
        // New Arrivals ke liye array ko reverse kiya hai taake naye products pehle aayein
        const reversedData = [...data].reverse();
        const productsWithImages = reversedData.map((product) => ({
          ...product,
          image: getProductImage(product.image),
        }));

        setProducts(productsWithImages);
      }
    } catch (error) {
      console.error("New Arrivals fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    // Tab change ya window focus par auto-refresh taake admin changes foran dikhein
    window.addEventListener("focus", fetchProducts);
    return () => window.removeEventListener("focus", fetchProducts);
  }, [fetchProducts]);

  // View All click hone par saare products, warna sirf shuru ke 4
  const displayedProducts = showAll ? products : products.slice(0, 4);

  return (
    <section className="product-section">
      <h2 className="section-title">NEW ARRIVALS</h2>

      <div className="products-grid">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product, index) => (
            <ProductCard
              key={product._id || product.id || index}
              product={product}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%", color: "#888", gridColumn: "1 / -1", padding: "40px" }}>
            No products available
          </p>
        )}
      </div>

      {!showAll && products.length > 4 && (
        <button className="view-all-btn" onClick={() => setShowAll(true)}>
          View All
        </button>
      )}
    </section>
  );
};

export default ProductSection;