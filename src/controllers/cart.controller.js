import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const getOrCreateCart = async (userId, sessionId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM carts WHERE sessionId = ? AND status = 'active' AND userId = ? LIMIT 1",
      [sessionId, userId],
      (err, results) => {
        if (err) return reject(err);

        if (results.length > 0) {
          return resolve(results[0]);
        }

        // Create a new cart for this session
        db.query(
          "INSERT INTO carts (userId, sessionId, status) VALUES (?, ?, 'active')",
          [userId, sessionId],
          (err2, res2) => {
            if (err2) return reject(err2);
            resolve({ id: res2.insertId, sessionId, status: "active" });
          }
        );
      }
    );
  });
};

export const addToCart = async (req, res) => {
  try {
    let sessionId = req.headers["x-session-id"];
    const { productId, quantity } = req.body;
     const userId = req.user.id;

    
    if (!sessionId) {
      sessionId = uuidv4();
      res.setHeader("x-session-id", sessionId); 
    }

    const cart = await getOrCreateCart(userId,sessionId);

    db.query(
      "SELECT * FROM cart_items WHERE cartId = ? AND productId = ?",
      [cart.id, productId],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
          // Update quantity
          const newQty = results[0].quantity + quantity;
          db.query(
            "UPDATE cart_items SET quantity = ? WHERE id = ?",
            [newQty, results[0].id],
            (err2) => {
              if (err2) return res.status(500).json({ error: err2.message });
              res.json({
                message: "Cart updated successfully",
                sessionId,
              });
            }
          );
        } else {
          db.query(
            "INSERT INTO cart_items (cartId, productId, quantity) VALUES (?, ?, ?)",
            [cart.id, productId, quantity],
            (err3) => {
              if (err3) return res.status(500).json({ error: err3.message });
              res.status(201).json({
                message: "Product added to cart",
                sessionId,
              });
            }
          );
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const sessionId = req.headers["x-session-id"];
  const userId = req.user.id;

  if (!sessionId)
    return res.status(400).json({ message: "Session ID is required" });

  db.query(
    "SELECT id FROM carts WHERE sessionId = ? AND status = 'active' AND userId = ? LIMIT 1",
    [sessionId, userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Cart not found" });

      const cartId = results[0].id;
      db.query(
        "UPDATE cart_items SET is_deleted = 1 WHERE cartId = ? AND productId = ? AND userId = ?",
        [cartId, productId, userId],
        (err2, result) => {
          if (err2) return res.status(500).json({ error: err2.message });
          if (result.affectedRows === 0)
            return res.status(404).json({ message: "Product not in cart" });
          res.json({ message: "Product removed successfully" });
        }
      );
    }
  );
};

export const getCart = async (req, res) => {
  const sessionId = req.headers["x-session-id"];

  if (!sessionId)
    return res.status(400).json({ message: "Session ID is required" });

  const sql = `
    SELECT 
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'cartItemId', ci.id,
          'productId', p.id,
          'productName', p.name,
          'quantity', ci.quantity,
          'price', p.price,
          'subtotal', (p.price * ci.quantity)
        )
      ) AS items,
      COALESCE(SUM(p.price * ci.quantity), 0) AS totalPrice
    FROM carts c
    LEFT JOIN cart_items ci ON ci.cartId = c.id
    LEFT JOIN products p ON p.id = ci.productId AND p.is_deleted = 0
    WHERE c.sessionId = ? AND c.status = 'active' AND c.userId = ?;
  `;

  db.query(sql, [sessionId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const data = results[0];
    const items = data.items ? JSON.parse(data.items) : [];

    res.json({
      sessionId,
      items,
      totalPrice: data.totalPrice,
    });
  });
};
