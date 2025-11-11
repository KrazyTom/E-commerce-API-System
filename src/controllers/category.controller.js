import db from '../config/db.js';

export const createCategory = (req, res) => {
  const { name, description } = req.body;

  const sql = "INSERT INTO categories (name,is_deleted,description) VALUES (?,0,?)";
  db.query(sql, [name, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Category created successfully", categoryId: result.insertId });
  });
};

export const updateCategory = (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const sql = "UPDATE categories SET name = ?, description = ? WHERE id = ? and is_deleted = 0";
  db.query(sql, [name, description, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category updated successfully" });
  });
};

export const deleteCategory = (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE categories SET is_deleted = 1 WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  });
};

export const listCategories = (req, res) => {
  const sql = "SELECT id,name,description FROM categories where is_deleted = 0 ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getCategoryById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT id,name,description FROM categories WHERE id = ? and is_deleted = 0";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Category not found" });
    res.json(results[0]);
  });
};
