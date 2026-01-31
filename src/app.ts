import 'dotenv/config';
import express from 'express';
import { extendReqMiddleware } from './middlewares/extendReq.middleware';
import { router } from './routes/index';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(extendReqMiddleware());

app.use('/api/v1', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Express server is running at port no :${PORT}`),
);

export default app;
