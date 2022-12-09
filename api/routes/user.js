const  { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyTokes");
const CryptoJs = require("crypto-js");
const User = require("../models/User");
const router = require("express").Router();

//PUT THE USER (UPDATING)
router.put("/:id", verifyToken ,async (res,req) => {
if(req.body.password){
    password: CryptoJs.AES.encrypt(req.body.password , process.env.PASS_SEC ).toString()
try{
    const UpdateUser = await user.findByIdAndUpdate(req.params.id, 
     {
      $set : req.body
      },
      {new: true}
      );

      res.status(500).json(UpdateUser);

} catch (err) {
    res.status(500).json(err);
}

}
});

//DELETE
router.delete("/:id",verifyTokenAndAuthorization , async (req, res) => {
    try{
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("user has been deleted ...")
    }catch(err){
        res.status(500).json(err)
    }
} )

//FIND USERS AS AN ADMIN
router.get("/find/:id",verifyTokenAndAdmin , async (req, res) => {
    try{
            const user = await User.findById(req.params.id);
            const {password, ...others} = user._doc;

            res.status(200).json(...others);

    }catch(err){
        res.status(500).json(err)
    }
} )

//GET ALL USERS 
router.delete("/:id",verifyTokenAndAuthorization , async (req, res) => {
    try{
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("user has been deleted ...")
    }catch(err){
        res.status(500).json(err)
    }
} )

//FIND USERS AS AN ADMIN
router.get("/",verifyTokenAndAdmin , async (req, res) => {
   const query = req.query.new;
    try{
            const users = query 
           ? await User.find().sort({_id: -1}).limit(5)
           : await User.find();

            res.status(200).json(users);

    }catch(err){
        res.status(500).json(err)
    }
} )

//GET STATS
router.get("/stats", verifyTokenAndAdmin, async(req, res) =>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));

    try{

        const data = await User.aggregate([ 
            { $match: {createdAt: {$gte: lastYear}}},
            {
                $project: {
                    month: { $month: "$createdAt"}
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1}

                }
            }
        ])
      
  res.status(200).json(data)

    }catch (err) {
    res.status(500).json(err)
    }
})

module.exports = router;