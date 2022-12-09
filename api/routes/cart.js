const router = require("express").Router();
const Cart = require("../models/Cart");
const  { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyTokes");
const CryptoJs = require("crypto-js");

//CREATE Cart
router.post("/", verifyToken, async (req,res) => {
    const newCart = new Cart(req.body);

    try{
    const savedCart = await newCart.save();
    res.status(200).json(newCart);

    }catch(err){
        res.status(500).json(err)
    }
});

//CART (UPDATING)
router.put("/:id", verifyTokenAndAuthorization ,async (res,req) => {

try{
    const UpdateCart = await Cart.findByIdAndUpdate(req.params.id, 
     {
      $set : req.body
      },
      {new: true}
      );

      res.status(500).json(UpdateCart);

} catch (err) {
    res.status(500).json(err);
}

}
);

//DELETE
router.delete("/:id",verifyTokenAndAuthorization , async (req, res) => {
    try{
            await Cart.findByIdAndDelete(req.params.id)
            res.status(200).json("Cart has been deleted ...")
    }catch(err){
        res.status(500).json(err)
    }
} )

//GET USER CART
router.get("/find/userId",verifyTokenAndAdmin , async (req, res) => {
    try{
            const cart = await Cart.findByIdOne({userId: req.params.userId });

            res.status(200).json(cart);

    }catch(err){
        res.status(500).json(err)
    }
} )



//GET ALL CARTS AS A USER
router.get("/",verifyTokenAndAdmin , async (req, res) => {
    try{
        const carts = await Cart.find()
            res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err)
    }
} );



module.exports = router;