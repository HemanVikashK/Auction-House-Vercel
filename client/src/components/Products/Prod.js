import React, { useEffect, useState } from "react";
import "./prod.css";
import { mainCategories, subCategories } from "./categories"; // Import the shared categories
import { useNavigate } from "react-router-dom";
import ProductDetailsModal from "./ProductDetailsModel";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useAuth } from "../../AuthContext";
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

function Prod() {
  const [products, setProducts] = useState([]);
  const [timerEndedProducts, setTimerEndedProducts] = useState([]);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [timeLeft, setTimeLeft] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { signedin } = useAuth();
  useEffect(() => {
    fetchProducts();
  }, [mainCategory, subCategory, searchTerm, currentPage, signedin]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/product/allproductsunsold"
      );
      const data = await response.json();
      if (data.status) {
        const currentTime = new Date();

        const [activeTimers, endedTimers] = data.data.reduce(
          (acc, product) => {
            const remainingTime =
              new Date(product.auction_start_time) - currentTime;
            if (remainingTime <= 0 || product.timerEnded) {
              acc[1].push(product);
            } else {
              acc[0].push({ ...product, remainingTime });
            }
            return acc;
          },
          [[], []]
        );

        const sortedActiveTimers = activeTimers.sort(
          (a, b) => a.remainingTime - b.remainingTime
        );

        const sortedProducts = [...sortedActiveTimers, ...endedTimers];

        const filteredProducts = sortedProducts.filter((product) => {
          return (
            (!mainCategory || product.main_category === mainCategory) &&
            (!subCategory || product.sub_category === subCategory) &&
            (!searchTerm ||
              product.name.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        });

        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = filteredProducts.slice(
          indexOfFirstProduct,
          indexOfLastProduct
        );

        setProducts(currentProducts);
      } else {
        console.error("Error fetching products");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

  const handleJoinAuction = (productId) => {
    navigate(`/product/${productId}`);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => (
    <li
      key={number}
      className={currentPage === number ? "active" : ""}
      onClick={() => setCurrentPage(number)}
    >
      {number}
    </li>
  ));

  const handleTimerEnd = (productId) => {
    setProducts((prevProducts) => {
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

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };
  const handlePriceRangeChange = (e) => {
    const [min, max] = e.target.value.split("-").map(Number);
    setPriceRange([min, max]);
  };

  const handleTimeLeftChange = (e) => {
    setTimeLeft(e.target.value);
  };
  const navigateTrial = () => {
    navigate("/product/36");
  };
  return (
    <>
      {signedin ? (
        <>
          <Carousel showThumbs={false} autoPlay infiniteLoop>
            <div>
              <img
                src="https://vikauction-bucket.s3.ap-south-1.amazonaws.com/2875365_8333.jpeg"
                alt="Slide 1"
              />
            </div>
            <div>
              <img
                src="https://vikauction-bucket.s3.ap-south-1.amazonaws.com/2875365_8334.jpeg"
                alt="Slide 2"
              />
            </div>
          </Carousel>
          <div className="containermain">
            <div className="filters container">
              <h6>Main Filter</h6>
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
              <hr />
              <h6>Sub Filter</h6>
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
              <hr />
              <h6>Price Range</h6>
              <select onChange={handlePriceRangeChange}>
                <option value="0-1000">₹0 - ₹1000</option>
                <option value="1000-5000">₹1000 - ₹5000</option>
                <option value="5000-10000">₹5000 - ₹10000</option>
                <option value="10000-20000">₹10000 - ₹20000</option>
              </select>
              <hr />
              <h6>Time Left</h6>
              <select onChange={handleTimeLeftChange}>
                <option value="">All</option>
                <option value="10">10 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
              <hr />
              <h6>Search</h6>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "5px" }}
              />
            </div>
            <div className="container-product">
              <div className="container10">
                <div className="wrapper">
                  <div className="banner-image">
                    <img
                      src="https://vikauction-bucket.s3.ap-south-1.amazonaws.com/8319d17b9a757ee3c4c2ce4044c53888f0ce3c228826309436501d48d10e6258"
                      alt="Image"
                      className="product-image"
                    />
                  </div>
                  <h1>Phone</h1>
                  <p style={{ fontSize: "x-small" }}>
                    Starting From
                    <br />
                    ₹10000
                  </p>
                  <div className="tag-container">
                    <div className={`tag`}>Pre-Owned</div>
                    <div className={`tag`}>Electronics</div>
                  </div>

                  <div className="button-wrapper">
                    <button
                      className="btn fill"
                      onClick={() => navigateTrial()}
                    >
                      JOIN LIVE AUCTION
                    </button>
                  </div>
                </div>
                {[...timerEndedProducts, ...products].map((product) => (
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
                      <div className={`tag`}>{product.main_category}</div>
                      <div className={`tag`}>{product.sub_category}</div>
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
                          {new Date(product.auction_start_time) - new Date() >
                            0 &&
                            new Date(product.auction_start_time) - new Date() <
                              10 * 60 * 1000 && (
                              <button
                                className="btn fill"
                                onClick={() => handleJoinAuction(product.id)}
                              >
                                JOIN LIVE AUCTION
                              </button>
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
                <ul
                  className="pagination"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <li onClick={handlePrevPage}>
                    <button
                      className="btn outline"
                      style={{ marginRight: "10px" }}
                    >
                      &laquo; Prev
                    </button>
                  </li>
                  {currentPage}
                  <li onClick={handleNextPage}>
                    <button
                      className="btn outline"
                      style={{ marginLeft: "10px" }}
                    >
                      Next &raquo;
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {selectedProduct && (
              <ProductDetailsModal
                product={selectedProduct}
                onClose={closeModal}
              />
            )}
          </div>{" "}
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

export default Prod;
