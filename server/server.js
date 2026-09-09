const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const roomsRouter = require("./routes/roomsRouter");
const userRouter = require("./routes/userRouter");
const errorHandler = require("./middleware/errorMiddleware");


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user",userRouter);
app.use("/rooms",roomsRouter);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Rstate server is healthy"
    });
});


app.use(errorHandler);
const PORT = process.env.PORT || 5001;



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});