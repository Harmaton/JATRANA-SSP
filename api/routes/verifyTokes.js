const jwt = require("jsonwebtoken");



const verifyToken = (res,req,next) => {
    const authHeader = req.headers.token;
    if (authHeader){
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SEC, (err,user) => {
          if(err) res.status(403).json("Token is not valid") ;
           req.user = user;
           next();
        });
    } else {
        return res.status(401).json("You are not Authenticated");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
      verifyToken( req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
            }else {
                res.status(403).json("you are not allowed to do that shit!");
            }
      })     
    };

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken( req, res, () => {
      if(req.user.isAdmin){
          next();
          }else {
              res.status(403).json("Only staff can do that, sorry");
          }
    })     
  };

module.exports = {
verifyToken,
 verifyTokenAndAuthorization,
verifyTokenAndAdmin };