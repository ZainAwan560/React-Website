import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import FilterSidebar from "../../Components/FilterSidebar/FilterSidebar";
import ProductCard from "../../Components/ProductCard/ProductCard";
import "./Category.css";
import { API_BASE_URL } from "../../config/api";
import { getProductImage } from "../../utils/imageHelper";
import { defaultProducts } from "../../data/defaultProducts";

const Category = () => {
  const [categoryProducts, setCategoryProducts] = useState(defaultProducts); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [maxPrice, setMaxPrice] = useState(500);

  const [appliedFilters, setAppliedFilters] = useState({
    category: null,
    color: null,
    maxPrice: 500,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageNumbers = [1, 2, 3, "...", 8, 9, 10];

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) return;
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const productsWithImages = data.map(product => ({
          ...product,
          image: getProductImage(product.image),
        }));

        setCategoryProducts(productsWithImages);
      }
    } catch (error) {
      console.error("Database se products fetch karne mein error:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    window.addEventListener("focus", fetchProducts);
    return () => window.removeEventListener("focus", fetchProducts);
  }, [fetchProducts]); 

  const handleApplyFilter = () => {
    setAppliedFilters({
      category: selectedCategory,
      color: selectedColor,
      maxPrice: maxPrice,
    });
  };

  const filteredProducts = categoryProducts.filter((product) => {
    const matchesCategory = appliedFilters.category
      ? product.category === appliedFilters.category
      : true;

    const matchesColor = appliedFilters.color
      ? product.colors && product.colors.includes(appliedFilters.color.toLowerCase())
      : true;

    const matchesPrice = product.price <= appliedFilters.maxPrice;

    return matchesCategory && matchesColor && matchesPrice;
  });

  return (
    <div className="category-page">
      <div className="category-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <strong>Casual</strong>
      </div>

      <div className="category-layout">
        <FilterSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onApply={handleApplyFilter}
        />

        <div className="category-main">
          <div className="category-header">
            <h1>Casual</h1>
            <div className="category-sort">
              <span>
                Showing {filteredProducts.length} of {categoryProducts.length} Products
              </span>
              <span className="sort-by">
                Sort by: <strong>Most Popular</strong>
              </span>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="no-products">Loading products or no products match your filters...</p>
          ) : (
            <div className="category-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}

          <div className="pagination">
            <button
              className="page-nav"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <i className="fa-solid fa-arrow-left"></i> Previous
            </button>

            <div className="page-numbers">
              {pageNumbers.map((num, index) =>
                num === "..." ? (
                  <span key={index} className="dots">...</span>
                ) : (
                  <button
                    key={index}
                    className={`page-number ${currentPage === num ? "active" : ""}`}
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </button>
                )
              )}
            </div>

            <button
              className="page-nav"
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;