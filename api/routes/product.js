const  { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyTokes");
const CryptoJs = require("crypto-js");
const Product = require("../models/Product");
const router = require("express").Router();

//CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async (req,res) => {
    const newProduct = new Product(req.body);

    try{
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);

    }catch(err){
        res.status(500).json(err)
    }
});

// (UPDATING) PRODUCT
router.put("/:id", verifyTokenAndAdmin ,async (res,req) => {
try{
    const UpdatedProduct = await Product.findByIdAndUpdate(req.params.id, 
     {
      $set : req.body
      },
      {new: true}
      );

      res.status(500).json(UpdatedProduct);

} catch (err) {
    res.status(500).json(err);
}

}
);

//DELETE PRODUCT
router.delete("/:id",verifyTokenAndAdmin , async (req, res) => {
    try{
            await Product.findByIdAndDelete(req.params.id)
            res.status(200).json("Product has been deleted ...")
    }catch(err){
        res.status(500).json(err)
    }
} )

//FIND Product By ID
router.get("/find/:id" , async (req, res) => {
    try{
            const Product = await User.findById(req.params.id);
            res.status(200).json(Product);
    }catch(err){
        res.status(500).json(err)
    }
} );


//DELETE PRODUCTS
router.delete("/:id",verifyTokenAndAdmin , async (req, res) => {
    try{
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Product has been deleted ...")
    }catch(err){
        res.status(500).json(err)
    }
} );

//GET ALL PRODUCTS
router.get("/" , async (req, res) => {
   const qNew = req.query.new;
   const qCategory = req.query.category;

    try{
        let products;
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5)
           } else if (qCategory){
            products = await Product.find({categories: {
                $in: [qCategory]
            }
        })
           } else{
            products = await Product.find()
           }
            res.status(200).json(products);

    }catch(err){
        res.status(500).json(err)
    }
} )


module.exports = router;