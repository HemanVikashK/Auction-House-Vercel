const express = require("express");
const router = express.Router();
const {
  createProd,
  delProd,
  editProd,
  getAllProd,
  getProd,
  getAllProdUnSold,
  getAllProdSold,
  getAuctionResult,
  getAllUserAuctionResults,
  getAllUserProducts,
} = require("../controller/productController");

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/create", upload.single("image"), createProd);
router.put("/edit", editProd);
router.delete("/delete/:id", delProd);
router.get("/allproductsunsold", getAllProdUnSold);
router.get("/allproductssold", getAllProdSold);
router.get("/auctionresult/:id", getAuctionResult);
router.get("/userauctionresults/:id", getAllUserAuctionResults);
router.get("/userproducts/:id", getAllUserProducts);

router.post("/prod", getProd);

module.exports = router;
