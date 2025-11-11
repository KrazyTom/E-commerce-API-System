
import db from '../config/db.js';

export const createProduct = (req, res) => {
  const { name, description, price, stockQuantity, categoryId } = req.body;

  console.log(req.user);

  const sql = `
    INSERT INTO products (name, description, price, stockQuantity, categoryId,updatedBy)
    VALUES (?, ?, ?, ?, ?,?)
  `;

  db.query(sql, [name, description, price, stockQuantity, categoryId, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Product created successfully", productId: result.insertId });
  });
};

export const updateProduct = (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  const updates = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(fields), req.user.id, id];

  const sql = `UPDATE products SET ${updates}, updatedBy = ? WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated successfully" });
  });
};

export const deleteProduct = (req, res) => {
  const { id } = req.params;

  db.query("UPDATE products SET is_deleted = 1, updatedBy = ? WHERE id = ?", [req.user.id, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  });
};

export const getProductById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(results[0]);
  });
};

export const listProducts = (req, res) => {
  const { page = 1, limit = 10, categoryId, minPrice, maxPrice } = req.body;
  console.log(req.body);

  let sql = "SELECT id,name,description,price,stockQuantity,categoryId,createdAt,updatedAt FROM products WHERE is_deleted = 0";
  const params = [];

  if (categoryId) {
    sql += " AND categoryId = ?";
    params.push(categoryId);
  }
  if (minPrice) {
    sql += " AND price >= ?";
    params.push(minPrice);
  }
  if (maxPrice) {
    sql += " AND price <= ?";
    params.push(maxPrice);
  }

  const offset = (page - 1) * limit;
  sql += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ page: Number(page), limit: Number(limit), products: results });
  });
};
