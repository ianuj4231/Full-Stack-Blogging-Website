import { Hono } from "hono"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { signupSchema } from "@ianuj4231/blogging-website-2024-common";
import { sign } from 'hono/jwt'
import { authenticateJwt } from '../middlewares/authormiddlewarejwtauthenticate';
import { sendEmail } from './emailService';
import { generateOTP, storeOTP, verifyOTP } from './otpService';

async function hashPassword(password: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return bufferToHex(hash);
}

function bufferToHex(buffer: ArrayBuffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2)).join('');
}

async function verifyPassword(inputPassword: string, storedPasswordHash: string) {
    const inputHash = await hashPassword(inputPassword);
    return inputHash === storedPasswordHash;
}


const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()



userRouter.post('/signup', async (c) => {
    console.log('Signup called');

    const { email } = await c.req.json();
    console.log('Received email:', email);
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const existingUser = await prisma.user.findUnique(
        {
            where: {
                email: email
            }
        }
    );

    if (existingUser) {
        return c.json({ message : 'User with this email already exists' }, 401);
    }

    const otpPurpose = "email_verification"
    const otp = generateOTP();
    const env = c.env;

    await storeOTP(env, email, otp, otpPurpose);
    const { success, error } = await sendEmail(env, email, 'Your OTP Code for email verification is', `Your OTP code is ${otp}`);

    if (!success) {
        return c.json({ error: `Failed to send OTP: ${error}` }, 500);
    }

    return c.json({ message: 'OTP sent to your email' }, 200);
});

userRouter.post('/verify-otp', async (c) => {
    const { email, otp, otpPurpose } = await c.req.json();
    console.log("type of otp is ", typeof (otp));
    console.log(email);
    console.log(otpPurpose);

    const env = c.env;
    const isValid = await verifyOTP(env, email, otp, otpPurpose);
    console.log("isValid", isValid);

    if (!isValid) {
        return c.json({ error: 'Invalid or expired OTPx' }, 400);
    }
    return c.json({ message: "otp is valid" }, 200);
});


userRouter.post("/signupFinal", async (c) => {
    console.log("signup called ");
    console.log();
    const body = await c.req.json()
    console.log(body);

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const { password, email, name } = body;

    

    const result = signupSchema.safeParse(body);

    if (!result.success) {
        return c.json({ errors: result.error.errors }, 400);
    }


    if (password) {
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                password: hashedPassword,
                email, name
            }
        })
        const payload = {
            id: user.id
            ,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
        }

        const token = await sign(payload, c.env.JWT_SECRET)
        return c.json({ message: "Signup successful", token });

    }
})

userRouter.post("/forgotPassword", async (c) => {
    console.log("xxx");
    const response = { message: "xxx" };
    console.log("Sending response:", response);
    c.json(response);

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    try {
        const body = await c.req.json();
        const { email } = body;
        console.log("email is", email);

        const env = c.env;
        const otpPurpose = "set_new_password";
        const otp = generateOTP();
        await storeOTP(env, email, otp, otpPurpose);
        const { success, error } = await sendEmail(env, email, 'Your OTP Code to set new password is ', `Your OTP code is ${otp}`);

        if (!success) {
            return c.json({ error: `Failed to send OTP: ${error}` }, 500);
        }
        else {
            return c.json({ message: 'OTP sent to your email' }, 200);
        }
    } catch (error) {
        c.status(500)
        c.json({ error: 'Server error. Please try again later.' });
    }
})

userRouter.put("/resetPassword", async (c) => {
    try {
        const body = await c.req.json();
        const { email, password } = body;
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());
        const hashedPassword = await hashPassword(password);
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });
        c.status(200);
      return c.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        c.status(500)
        return c.json({ error: 'Server error. Please try again later.' });
    }
})

userRouter.post("/signin", async (c) => {
    const body = await c.req.json();
    const { email, password } = body;

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return c.json({ error: 'Invalid email or password' }, 401);
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
        return c.json({ error: 'Invalid email or password' }, 401);
    }

    const payload = {
        id: user.id
        ,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
    }

    const token = await sign(payload, c.env.JWT_SECRET)

    return c.json({ message: "Signin successful", token });
});


userRouter.post("/blog", authenticateJwt, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());


    try {
        const body = await c.req.json();

        const { title, content } = body;
        await prisma.post.create({
            data: {
                title,
                content,
                authorId: (c.req as any).user.id
            }
        })
        return c.json({ message: 'Blog post created successfully!' });

    } catch (error) {
        console.log(error);
    }

});


userRouter.get("/blog/bulk", async (c) => {
    console.log("bulk ");

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    try {
        const allPosts = await prisma.post.findMany()
        return c.json(allPosts, 200)
    } catch (error) {
        return c.json({ error: 'Failed to retrieve posts' }, 410);
    }

})

userRouter.get("/getPostsofOneAuthor", authenticateJwt, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    try {
        const authorId = (c.req as any).user.id;
        console.log("authorId ", authorId);
        
        let postsOfOne = await prisma.post.findMany({
            where: {
                authorId
            }
        })
        c.status(200);
       return c.json({ postsOfOne })

    } catch (error) {
        c.status(500);
        c.json({ message: 'Failed to fetch posts' })
    }
})

userRouter.get("/blog/:id", async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        let postId = c.req.param('id');

        let postIdx = parseInt(postId);
        const postobj = await prisma.post.findUnique({
            where: {
                id: postIdx
            }
        });
        return c.json(postobj, 200);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return c.json({ error: "Post not found" }, 404);
        }
        return c.json({ error: "Post not found" }, 404);
    }
})


userRouter.put("/editBlog/:id", authenticateJwt, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
console.log("xxxxxx");

    try {
        let postId = c.req.param('id');
        let postIdx = parseInt(postId);
        const body = await c.req.json();
        const { title, content } = body;
        await prisma.post.update({
            where: {
                id: postIdx
            },
            data: {
                title,
                content
            }
        })
        return c.json({ message: "post updated" }, 200);

    } catch (error: any) {
        if (error.code === 'P2025') {
            return c.json({ error: "Post not found" }, 404);
        }
        return c.json({ error: "Post not found" }, 404);
    }
})

userRouter.delete("/deleteBlog/:id", authenticateJwt, async function (c) {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        let postId = c.req.param('id');
        let postIdx = parseInt(postId);
        await prisma.post.delete({
            where: {
                id: postIdx
            }
        })
        return c.json({ message: "post deleted" }, 200);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return c.json({ error: "Post not found" }, 404);
        }
        return c.json({ error: "Post not found" }, 404);
    }
}
)

export default userRouter;