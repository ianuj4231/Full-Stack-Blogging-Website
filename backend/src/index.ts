import { Hono } from 'hono'
import mainRouter from "./routes/index";
const app = new Hono()
import { cors } from 'hono/cors'
app.use('/api/*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/v1', mainRouter );
export default app