import { useState, useEffect } from "react";
import "./ProductDetails.css";
import { Link, useParams } from "react-router-dom";
import Reviews from "../../Components/Reviews/Reviews";
import ProductRecommendations from "../../Components/ProductRecommendations/ProductRecommendations";
import { useCart } from "../../Context/Cart";
import { API_BASE_URL } from "../../config/api";
import { getProductImage } from "../../utils/imageHelper";
import { defaultProducts } from "../../data/defaultProducts";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          const realImage = getProductImage(data.image);
          
          setProduct({ ...data, image: realImage });
          setMainImage(realImage);
          if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
          if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn("API se product nahi mila, default list check ho rahi hai:", error);
      }

      // Fallback from defaultProducts
      const fallbackItem = defaultProducts.find((p) => String(p._id) === String(id) || String(p.id) === String(id));
      if (fallbackItem) {
        const realImg = getProductImage(fallbackItem.image);
        setProduct({ ...fallbackItem, image: realImg });
        setMainImage(realImg);
        setSelectedColor("Black");
        setSelectedSize("Medium");
      }
      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addToCart({
      ...product,
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontSize: '20px' }}>Loading...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '100px' }}>Product nahi mila!</div>;

  return (
    <main className="product-details-page">
      <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/category">Shop</Link>
        <span>/</span>
        <Link to={`/category?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        <strong>{product.name}</strong>
      </div>

      <section className="product-main">
        <div className="product-gallery">
          <div className="thumbnail-list">
            {[product.image, product.image, product.image].map((img, index) => (
              <button
                key={index}
                type="button"
                className={`thumbnail ${mainImage === img && index === 0 ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              >
                <img 
                  src={img} 
                  alt={product.name} 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/products/cloth1.png";
                  }}
                />
              </button>
            ))}
          </div>

          <div className="main-product-image">
            <img 
              src={mainImage} 
              alt={product.name} 
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/products/cloth1.png";
              }}
            />
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name.toUpperCase()}</h1>

          <div className="rating-row">
            <span className="stars">★★★★★</span>
            <span className="rating-number">{product.rating || "0"}/5</span>
          </div>

          <div className="price-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <span className="product-price" style={{ margin: 0 }}>${product.price}</span>
            {product.oldPrice && (
              <>
                <span className="old-price" style={{ textDecoration: 'line-through', color: '#999', marginLeft: '12px', fontSize: '18px' }}>${product.oldPrice}</span>
                <span className="discount" style={{ color: '#ff3333', marginLeft: '12px', background: '#ffe6e6', padding: '4px 10px', borderRadius: '15px', fontSize: '14px', fontWeight: 'bold' }}>-{product.discount}%</span>
              </>
            )}
          </div>

          <p className="product-description">
            {product.description || "This item is perfect for any occasion. Crafted from high-quality materials, it offers exceptional comfort and style."}
          </p>

          <div className="product-line"></div>

          <div className="option-section">
            <p className="option-title">Select Colors</p>
            <div className="color-options">
              {product.colors && product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={color}
                  className={`color ${selectedColor === color ? "selected" : ""}`}
                  style={{ 
                    backgroundColor: color, 
                    border: selectedColor === color ? '2px solid black' : '1px solid #ccc',
                    boxShadow: selectedColor === color ? '0 0 0 2px white inset' : 'none'
                  }}
                  onClick={() => setSelectedColor(color)}
                >
                  {selectedColor === color && "✓"}
                </button>
              ))}
            </div>
          </div>

          <div className="product-line"></div>

          <div className="option-section">
            <p className="option-title">Choose Size</p>
            <div className="size-options">
              {product.sizes && product.sizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  className={selectedSize === size ? "selected-size" : ""}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-line"></div>

          <div className="purchase-row">
            <div className="quantity-box">
              <button type="button" onClick={decreaseQuantity}>−</button>
              <span>{quantity}</span>
              <button type="button" onClick={increaseQuantity}>+</button>
            </div>

            <button type="button" className="add-cart-button" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      <Reviews />
      <ProductRecommendations />
    </main>
  );
};

export default ProductDetails;