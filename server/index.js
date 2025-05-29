import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import { connectDB } from "./services/DB.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import profileRoute from "./routes/profile.route.js";
import path from "path";
import blogRouter from './routes/blog.route.js'

const __dirname = path.resolve();
config();
connectDB();
const app = express();
app.set('trust proxy', true);
app.use(express.json({
  limit: '100mb'
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoute);
app.use('/api/blogs',  blogRouter);
app.use("/api", authMiddleware, profileRoute);



if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*name', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    })
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
