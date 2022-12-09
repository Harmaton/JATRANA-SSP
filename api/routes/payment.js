const router = require("express").Router();
const axios = require('axios');

 //generate token middleware
 const generatetoken = async (req, res, next) => {
    const secret = process.env.MPESA_CONSUMER_SECRET_KEY
    const consumer = process.env.MPESA_CONSUMER
    const auth = new Buffer.from(`${consumer}: ${secret}`).toString("base64")

        await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
         {
            headers : {
                authorization: `Basic ${auth}`
            }
        }).then((response) => {
            // console.log(data);
            token = response.data.access_token;
            next();
        }).catch((err) => {
            console.log(err);
            res.status(400).json(err.message)
        })   
 }

 router.get("/token", (res,req) => {
    generatetoken()
 })

//MPESA PAYMENTS API
router.post("/stk", generatetoken, async (res, req) => {
    const phone = req.body.phone.subString[0];
    const amount = req.body.amount;
     
    const date = new Date();

    const timestamp = 
    date.getFullYear()+ 
    ("0" + (date.getMonth() + 1)).slice(-2)+
    ("0" + date.getDate()).slice(-2)+
    ("0" + date.getHours()).slice(-2)+
    ("0" + date.getMinutes()).slice(-2)+
    ("0" + date.getSeconds()).slice(-2);

    const shortCode = process.env.MPESA_PAYBILL;
    const passKey = process.env.MPESA_PASSKEY;

    const password = new Buffer.from(shortCode + passKey+ timestamp).toString("base64")
    

   
    await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {    
        "BusinessShortCode":shortCode,    
        "Password": password,    
      "Timestamp":timestamp,    
      "TransactionType": "CustomerPayBillOnline",    
        "Amount":amount,    
       "PartyA":`254${phone}`,    
        "PartyB":shortCode,    
      "PhoneNumber":`254${phone}`,    
      "CallBackURL":"https://mydomain.com/pat",    
      "AccountReference": `254${phone}`,    
      "TransactionDesc":"Test"
     },
     {
        header: {
            Authorization: `Bearer ${token}`, 
        }
     }

    ).then( (data) => {
        try{
        console.log(data.data);
        res.status(200).json(data.data)
        }catch(err){
            console.log(err);
            res.status(400).json(err.message)
        }
    })
})

router.post("/callback", (req,res) => {
    const callBackData = req.body
    console.log(callBackData.Body)

    if(!callBackData.Body.callbackMetadata){
        console.log(callBackData.stkCallback.Body)
        res.json("ok")
    }
console.log(callBackData.Body.stkCallback.callbackMetadata)
})


module.exports = router;