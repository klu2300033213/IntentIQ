import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getProductImage, getCategoryFallbackImage } from '../data/products';

export default function ProductCard({ product, compact = false }) {
  const { addToCart, toggleWishlist, isInWishlist, t } = useShop();
  const isWish = isInWishlist(product.id);
  const img = product.image || getProductImage(product);
  const discount = product.discount || 0;
  const rating = Number(product.rating || 4.4).toFixed(1);
  const reviews = product.reviews ? product.reviews.toLocaleString() : '0';

  return (
    <article className="iq-product-card group">
      {/* ── Image Area ── */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="iq-product-img-wrap">
          <img
            src={img}
            alt={product.name}
            className="iq-product-img"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getCategoryFallbackImage(product.category);
            }}
          />

          {/* Discount badge */}
          {discount > 5 && (
            <div className="absolute top-2 left-2 iq-badge-deal">
              -{discount}%
            </div>
          )}

          {/* AI score badge */}
          {product.aiScore && product.aiScore >= 90 && (
            <div className="absolute bottom-2 left-2 iq-badge-ai flex items-center gap-1">
              <Zap size={9} />
              AI Pick
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
        className={`iq-wishlist-btn ${isWish ? 'active' : ''}`}
        aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={15} fill={isWish ? 'currentColor' : 'none'} color={isWish ? 'white' : '#8B90B5'} />
      </button>

      {/* ── Content ── */}
      <div className="iq-product-body">
        <p className="iq-product-brand">{product.brand}</p>

        <Link to={`/product/${product.id}`}>
          <h3 className="iq-product-name group-hover:text-blue-300 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="iq-product-rating">
          <span className="iq-product-rating-badge">
            <Star size={10} fill="currentColor" color="#69F0AE" />
            {rating}
          </span>
          <span className="iq-product-reviews">({reviews})</span>
        </div>

        {/* Pricing */}
        <div className="iq-price-row mt-1">
          <span className="iq-price-current">₹{(product.price || 999).toLocaleString()}</span>
          {product.oldPrice && (
            <span className="iq-price-old">₹{product.oldPrice.toLocaleString()}</span>
          )}
          {discount > 5 && (
            <span className="iq-price-discount">{discount}% {t('off')}</span>
          )}
        </div>

        <p className="iq-free-delivery">{t('free_delivery')}</p>
      </div>

      {/* ── Add to Cart ── */}
      <button
        onClick={() => addToCart(product)}
        className="iq-add-cart"
        aria-label={`Add ${product.name} to cart`}
      >
        <ShoppingCart size={14} />
        {t('add_to_cart')}
      </button>
    </article>
  );
}
