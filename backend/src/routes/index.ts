import { Hono } from 'hono'
const mainRouter = new Hono()
import userRouter from "./user";
mainRouter.route("/user", userRouter);

export default mainRouter