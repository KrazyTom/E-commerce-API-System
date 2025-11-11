import expess from 'express';
import cors from 'cors';
import dotenv from "dotenv";


dotenv.config();
const app = expess();   
app.use(cors());
app.use(expess.json()); 

app.get('/', (req, res) => {
  res.send('Welcome to Express + MYSQL E-commerce API System');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));