import React, { useEffect, useState } from "react";
import "../Products/prod.css";
import { mainCategories, subCategories } from "../Products/categories";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../../AuthContext";
import ProductDetailsModal from "../Products/ProductDetailsModel";

const CountdownTimer = ({ time, onTimerEnd }) => {
  const [remainingTime, setRemainingTime] = useState(time);

  useEffect(() => {
    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1000 : 0));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      onTimerEnd();
    }
  }, [remainingTime, onTimerEnd]);

  const formatTime = (ms) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return <span>{formatTime(remainingTime)}</span>;
};

function History() {
  const [unsoldproducts, setUnSoldProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [totalFilteredProducts, setTotalFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bids, setBids] = useState([]);
  const [buyer, setBuyer] = useState("");
  const [timerEndedProducts, setTimerEndedProducts] = useState([]);
  const { user, signedin } = useAuth();

  useEffect(() => {
    fetchUserProducts();
  }, [mainCategory, subCategory, searchTerm, currentPage, user]);

  const fetchUserProducts = async () => {
    try {
      console.log(user);
      const id = user.id; // Replace with actual user ID
      const response1 = await fetch(
        `https://auction-house-vercel.onrender.com/product/userauctionresults/${id}`
      );
      const data1 = await response1.json();

      if (data1.status) {
        const filteredProducts1 = data1.data.filter((product) => {
          return (
            (!mainCategory || product.main_category === mainCategory) &&
            (!subCategory || product.sub_category === subCategory) &&
            (!searchTerm ||
              product.name.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        });

        setTotalFilteredProducts(filteredProducts1);

        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = filteredProducts1.slice(
          indexOfFirstProduct,
          indexOfLastProduct
        );

        setProducts(currentProducts);
      } else {
        console.error("Error fetching user products");
      }

      const response2 = await fetch(
        `https://auction-house-vercel.onrender.com/product/userproducts/${id}`
      );
      const data2 = await response2.json();

      if (data2.status) {
        const filteredProducts2 = data2.data.filter((product) => {
          return (
            (!mainCategory || product.main_category === mainCategory) &&
            (!subCategory || product.sub_category === subCategory) &&
            (!searchTerm ||
              product.name.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        });

        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = filteredProducts2.slice(
          indexOfFirstProduct,
          indexOfLastProduct
        );

        setUnSoldProducts(currentProducts);
      } else {
        console.error("Error fetching user products");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

  const handleViewAuction = (bids, buyer) => {
    setBids(bids);
    setShowModal(true);
    setBuyer(buyer);
  };

  const handleMainCategoryClick = (category) => {
    setMainCategory(mainCategory === category ? "" : category);
  };

  const handleSubCategoryClick = (category) => {
    setSubCategory(subCategory === category ? "" : category);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleClose = () => setShowModal(false);

  const handleTimerEnd = (productId) => {
    setUnSoldProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.id === productId ? { ...product, timerEnded: true } : product
      );
      const timerEndedProduct = updatedProducts.find(
        (product) => product.id === productId
      );
      setTimerEndedProducts((prevTimerEndedProducts) => [
        ...prevTimerEndedProducts,
        timerEndedProduct,
      ]);
      return updatedProducts.filter((product) => product.id !== productId);
    });
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      {signedin ? (
        <>
          <div className="containermain">
            <div className="filters container">
              <div className="tag-container">
                {mainCategories.map((category) => (
                  <div
                    key={category}
                    className={`tag ${
                      mainCategory === category ? "selected" : ""
                    }`}
                    onClick={() => handleMainCategoryClick(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
              <div className="tag-container">
                {subCategories.map((category) => (
                  <div
                    key={category}
                    className={`tag ${
                      subCategory === category ? "selected" : ""
                    }`}
                    onClick={() => handleSubCategoryClick(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ margin: "10px", padding: "5px" }}
              />
            </div>
            <div className="containerflex">
              <h1 style={{ marginLeft: "30px", marginTop: "30px" }}>
                Pending Products
              </h1>
              <div className="container10">
                {unsoldproducts.map((product) => (
                  <div key={product.id} className="wrapper">
                    <div className="banner-image">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                    <h1>{product.name}</h1>
                    <p style={{ fontSize: "x-small" }}>
                      Starting From
                      <br />₹{product.starting_price}
                    </p>
                    <div className="tag-container">
                      <div className="tag">{product.main_category}</div>
                      <div className="tag">{product.sub_category}</div>
                    </div>
                    <div className="button-wrapper">
                      {product.auction_start_time && !product.timerEnded ? (
                        <>
                          <button
                            className="btn outline"
                            onClick={() => handleViewDetails(product)}
                          >
                            VIEW DETAILS
                          </button>
                          {new Date(product.auction_start_time) - new Date() >
                            0 && (
                            <p style={{ fontSize: "x-small" }}>
                              Auction will start in :<br />
                              <CountdownTimer
                                time={
                                  new Date(product.auction_start_time) -
                                  new Date()
                                }
                                onTimerEnd={() => handleTimerEnd(product.id)}
                              />
                            </p>
                          )}

                          {new Date(product.auction_start_time) - new Date() <
                            0 && (
                            <p style={{ fontSize: "x-small" }}>
                              <button className="btn closed" disabled>
                                CLOSED
                              </button>
                            </p>
                          )}
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              <h1 style={{ marginLeft: "30px", marginTop: "30px" }}>
                Sold Products
              </h1>
              <div className="container10">
                {products.map((product) => (
                  <div key={product.id} className="wrapper">
                    <div className="banner-image">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                    <h1>{product.name}</h1>
                    <p style={{ fontSize: "x-small" }}>
                      Sold At
                      <br />₹{product.sold_at} to {product.sold_to}
                    </p>
                    <div className="tag-container">
                      <div className="tag">{product.main_category}</div>
                      <div className="tag">{product.sub_category}</div>
                    </div>
                    <div className="button-wrapper">
                      <button
                        className="btn outline"
                        onClick={() =>
                          handleViewAuction(product.bids, product.buyer)
                        }
                      >
                        VIEW BIDS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                <h1 style={{ color: "black", fontSize: "50px" }}>BIDS</h1>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {bids.map((bid) => (
                <div key={bid.id}>
                  <h4>
                    {bid.user} bid ₹{bid.amount}
                  </h4>
                </div>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <b>SOLD TO</b> {buyer}
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          {selectedProduct && (
            <ProductDetailsModal
              product={selectedProduct}
              show={selectedProduct !== null}
              onClose={closeModal}
            />
          )}
        </>
      ) : (
        <>
          <div className="elsecontainer">
            <img
              className="elseimg"
              src="https://vikauction-bucket.s3.ap-south-1.amazonaws.com/hand-drawn-no-data-illustration_23-2150544946.avif"
            ></img>
            <h1 className="elseh1">
              Oops!!!
              <br /> YOU NEED TO SIGN IN FIRST
            </h1>
          </div>
        </>
      )}
    </>
  );
}

export default History;
