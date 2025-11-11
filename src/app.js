import expess from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js';

dotenv.config();
const app = expess();   
app.use(cors());
app.use(expess.json()); 



app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Express + MYSQL E-commerce API System');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));