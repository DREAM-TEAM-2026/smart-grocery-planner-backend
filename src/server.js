import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: '*',
  }),
);

app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
