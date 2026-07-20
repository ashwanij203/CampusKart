const express=require("express");

const router=express.Router();
const upload = require("../middleware/upload");

const{

addProduct,

getProducts,

getProduct,

updateProduct,

deleteProduct,

myProducts

}=require("../controllers/product.controller");

const{

verifyToken

}=require("../middleware/auth");

router.post("/", verifyToken, upload.array("images", 5),addProduct);

router.get("/",getProducts);

router.get("/my-products",verifyToken,myProducts);

router.get("/:id",getProduct);

router.put("/:id",verifyToken,updateProduct);

router.delete("/:id",verifyToken,deleteProduct);

module.exports=router;