import { Hono } from "hono"

const userRouter = new Hono()

userRouter.post("/signup", (c) => {
    console.log("signup called ");
    return c.text("signup route");
})

userRouter.get("/signin", (c) => {
    return c.text("signin route");
})

userRouter.get("/blog/:id", (c) => {
    return c.text('blog route')
})

userRouter.put("/blog", (c) => {
    return c.text('blog route')
})

userRouter.get("/blog/bulk", (c) => {
    return c.text("blog bulk")
})

userRouter.post("/blog", (c) => {
    return c.text("post-method blog")
});

export default userRouter;