const express = require('express');
const cors = require("cors")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser");
const connectDB = require('./config/connectSql');
const authRoutes = require('./routes/authRoutes');
dotenv.config()
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
// const connectDB = require("./config/connectSql.js")

const app = express()
const port = process.env.port || 8080

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use((err, req, res, next) => {
    console.error("Lỗi toàn cục:", err);
    res.status(500).json({ error: "Lỗi hệ thống, vui lòng thử lại!" });
});
connectDB()
// app.use('/api/admin', adminRoute)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);




app.listen(port, () => {
    console.log(`server running on port *${port}`);
})
// connectDB()
app.get('/', (req, res) => {
    res.send('sever nodejs nong san - Kydtrai11')
})






