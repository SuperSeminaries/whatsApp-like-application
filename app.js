import  express  from "express";

const app = express();
import userRouter from './src/routes/user.routes.js'
import cookieParser from "cookie-parser";

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/auth', userRouter);


export { app }