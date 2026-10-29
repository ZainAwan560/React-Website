import "./ProductCard.css";
import { Link } from "react-router-dom";
import { useCart } from "../../Context/Cart.jsx";
import { getProductImage } from "../../utils/imageHelper";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  // MongoDB ki ID "_id" hoti hai, hum dono check kar lete hain taake error na aaye
  const productId = product._id || product.id; 

  return (
    <div className="product-card">
      <Link
        to={`/product/${productId}`}
        state={product}
        className="product-link"
      >
        <div className="product-image-box">
          <img 
            src={getProductImage(product.image)} 
            alt={product.name} 
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/products/cloth1.png";
            }}
          />

          <button
            className="add-to-cart-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Cart ke liye hum purani id ko _id se barabar kar dete hain
              addToCart({ ...product, id: productId }); 
            }}
          >
            Add to Cart
          </button>
        </div>

        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          <span className="stars">★★★★★</span>
          <span className="rating-number">{product.rating}/5</span>
        </div>

        <div className="price-row">
          <span className="product-price">${product.price}</span>

          {product.oldPrice && (
            <>
              <span className="old-price">${product.oldPrice}</span>
              <span className="discount">-{product.discount}%</span>
            </>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;