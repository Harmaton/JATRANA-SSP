const express = require('express');
const app = express();



const mongoose = require("mongoose");

const dotenv = require("dotenv");

//Routes
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order')
const cartRoute = require('./routes/cart')

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => console.log("DB connection successful")).catch((err) => {
    console.log(err);
})

//End-Points
app.use(express.json());
app.use("/api ", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute)
app.use('api/orders', orderRoute)
app.use('/api/cart', cartRoute)

app.listen(process.env.PORT || 5000 , () => console.log("server running!!"));