import { Hono, MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';


export const authenticateJwt: MiddlewareHandler = async (c, next) => {


  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  console.log(token);

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const decoded = await verify(token, c.env.JWT_SECRET);
    console.log(decoded);
    (c.req as any).user = decoded;
    await next();
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};