import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import toast from "react-hot-toast";
import "../styles/ProductCard.css";

const ProductCard = ({ product, inStock = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  // Generate variants based on product category
  const getVariantOptions = () => {
    switch (product.category) {
      case "men's clothing":
      case "women's clothing":
        return ["XS", "S", "M", "L", "XL"];
      case "electronics":
        return ["Standard", "Deluxe"];
      case "jewelery":
        return ["Silver", "Gold"];
      default:
        return [];
    }
  };

  const variants = getVariantOptions();

  const [selectedVariant, setSelectedVariant] = useState("");

  useEffect(() => {
    if (inStock && variants.length > 0) {
      if (product.category && product.category.includes("clothing")) {
        setSelectedVariant("M");
      } else {
        setSelectedVariant(variants[0]);
      }
    }
  }, [product.id, inStock, product.category, variants]);

  // Handle adding product to cart
  const handleAddToCart = () => {
    if (!inStock) return;

    const productToAdd = selectedVariant
      ? { ...product, variant: selectedVariant }
      : product;

    dispatch(addCart(productToAdd));
    toast.success(`Added ${product.title} to cart`);
  };

  // Get variant CSS class
  const getVariantClass = (variant) => {
    const baseClass = "variant-btn";
    const selectedClass = selectedVariant === variant ? "selected" : "";
    const variantClass = `variant-${variant.toLowerCase()}`;

    return `${baseClass} ${variantClass} ${selectedClass}`;
  };

  // Render star rating
  const renderRating = () => {
    if (!product.rating) return null;

    const { rate, count } = product.rating;
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate - fullStars >= 0.5;

    return (
      <div className="rating-container">
        <div className="rating-stars">
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) {
              return <i key={i} className="bi bi-star-fill"></i>;
            } else if (i === fullStars && hasHalfStar) {
              return <i key={i} className="bi bi-star-half"></i>;
            } else {
              return <i key={i} className="bi bi-star"></i>;
            }
          })}
          <span className="ms-2">{rate}</span>
        </div>
        <span className="rating-count">({count} reviews)</span>
      </div>
    );
  };

  // Get variant label based on product category
  const getVariantLabel = () => {
    if (!product.category) return "Select Option";

    const category = product.category.toLowerCase();
    if (category.includes("clothing")) return "Select Size";
    if (category === "jewelery") return "Select Material";
    return "Select Option";
  };

  return (
    <div
      className={`card product-card h-100 ${
        isHovered ? "shadow" : "shadow-sm"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="image-container position-relative">
        {!inStock && (
          <div className="out-of-stock-overlay position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
            <span className="badge bg-danger fs-5 p-2">Out of Stock</span>
          </div>
        )}
        <img className="card-img-top" src={product.image} alt={product.title} />
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="product-title" title={product.title}>
          {product.title}
        </h5>

        {renderRating()}

        <div className="price-container">
          <span className="fs-5 fw-bold">${product.price}</span>
          {inStock && (
            <span className="badge bg-success stock-badge">
              <i className="bi bi-check-circle me-1"></i>
              In Stock
            </span>
          )}
        </div>

        {variants.length > 0 && (
          <div className="variant-container">
            <label className="form-label fw-medium mb-1">
              <i className="bi bi-palette-fill me-1"></i>
              {getVariantLabel()}
            </label>

            <div className="variant-options">
              {variants.map((variant) => (
                <button
                  key={variant}
                  type="button"
                  className={getVariantClass(variant)}
                  onClick={() => inStock && setSelectedVariant(variant)}
                  disabled={!inStock}
                >
                  {variant}
                </button>
              ))}
            </div>

            {!selectedVariant && inStock && (
              <div className="text-muted small mt-2">
                <i className="bi bi-info-circle me-1"></i>
                Please select an option to continue
              </div>
            )}
          </div>
        )}

        <div className="mt-auto d-flex flex-wrap gap-2">
          <Link
            to={`/product/${product.id}`}
            className="btn btn-outline-dark flex-grow-1 btn-details"
          >
            <i className="bi bi-eye me-1"></i>
            Details
          </Link>

          {inStock ? (
            <button
              className="btn btn-primary flex-grow-1 btn-cart"
              onClick={handleAddToCart}
              disabled={variants.length > 0 && !selectedVariant}
            >
              <i className="bi bi-cart-plus me-1"></i>
              Add to Cart
            </button>
          ) : (
            <button className="btn btn-secondary flex-grow-1" disabled>
              <i className="bi bi-x-circle me-1"></i>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
