const router = require("express").Router();
const Order = require("../models/Order");
const  { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyTokes");

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

//ORDER (UPDATING)
router.put("/:id", verifyTokenAndAdmin ,async (res,req) => {

try{
    const UpdateOrder = await Order.findByIdAndUpdate(req.params.id, 
     {
      $set : req.body
      },
      {new: true}
      );

      res.status(500).json(UpdateOrder);

} catch (err) {
    res.status(500).json(err);
}
}
);

//DELETE Order
router.delete("/:id",verifyTokenAndAuthorization , async (req, res) => {
    try{
            await Order.findByIdAndDelete(req.params.id)
            res.status(200).json("Order has been deleted ...")
    }catch(err){
        res.status(500).json(err)
    }
} );


//GET USER ORDER
router.get("/find/userId",verifyTokenAndAdmin , async (req, res) => {
    try{
            const order = await Cart.find({userId: req.params.userId });

            res.status(200).json(order);

    }catch(err){
        res.status(500).json(err)
    }
} )



//GET ALL Orders
router.get("/",verifyTokenAndAdmin , async (req, res) => {
    try{
        const orders = await Order.find()
            res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err)
    }
} );

//GET ALL ORDER STATS BY A