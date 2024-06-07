import React from 'react';
import './ProductDetailsModal.css';

const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-left">
          <img src={product.image_url} alt={product.name} className="modal-image" />
        </div>
        <div className="modal-right">
          <h1 className="modal-title">{product.name}</h1>
          <p className="modal-description">{product.description}</p>
          <p className="modal-price">Starting From ₹{product.starting_price}</p>
          <div className="modal-categories">
            <span className="modal-category">{product.main_category}</span>
            <span className="modal-category">{product.sub_category}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
