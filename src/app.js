import expess from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js';
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";

dotenv.config();
const app = expess();   
app.use(cors());
app.use(expess.json()); 


app.use('/api/auth', authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Express + MYSQL E-commerce API System');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));