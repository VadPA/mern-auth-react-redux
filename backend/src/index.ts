import express, { json, urlencoded } from 'express';
import authRoutes from './routes/auth/index';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(urlencoded({ extended: false}));
app.use(json());

app.get('/', (req, res) => {
  res.send('Hello world!');
})

app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`)
})

