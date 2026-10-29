import { useState, useEffect, useCallback } from "react";
import "./TopSelling.css";
import ProductCard from "../ProductCard/ProductCard";
import { API_BASE_URL } from "../../config/api";
import { getProductImage } from "../../utils/imageHelper";
import { defaultProducts } from "../../data/defaultProducts";

const TopSelling = () => {
  const [products, setProducts] = useState(() => defaultProducts.slice(4, 12));
  const [showAll, setShowAll] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) return;
      const data = await response.json();

      if (Array.isArray(data)) {
        const productsWithImages = data.map((product) => ({
          ...product,
          image: getProductImage(product.image),
        }));

        setProducts(productsWithImages);
      }
    } catch (error) {
      console.error("Top Selling fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    // Tab switch ya window focus par auto-refetch
    window.addEventListener("focus", fetchProducts);
    return () => window.removeEventListener("focus", fetchProducts);
  }, [fetchProducts]);

  // View All click hone par saare products, warna sirf shuru ke 4
  const displayedProducts = showAll ? products : products.slice(0, 4);

  return (
    <section className="top-selling">
      <h2>TOP SELLING</h2>

      <div className="top-selling-container">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product, index) => (
            <ProductCard 
              key={product._id || product.id || index} 
              product={product} 
            />
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%", color: "#888", padding: "40px" }}>
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

export default TopSelling;