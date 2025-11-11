import db from '../config/db.js';

const getOrCreateCart = async (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM carts WHERE userId = ? AND status = 'active' LIMIT 1",
      [userId],
      (err, results) => {
        if (err) return reject(err);
        if (results.length > 0) return resolve(results[0]);

        // Create new active cart
        db.query(
          "INSERT INTO carts (userId, status) VALUES (?, 'active')",
          [userId],
          (err2, res2) => {
            if (err2) return reject(err2);
            resolve({ id: res2.insertId, userId, status: "active" });
          }
        );
      }
    );
  });
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const cart = await getOrCreateCart(userId);

    db.query(
      "SELECT * FROM cart_items WHERE cartId = ? AND productId = ?",
      [cart.id, productId],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
          const newQty = results[0].quantity + quantity;
          db.query(
            "UPDATE cart_items SET quantity = ? WHERE id = ?",
            [newQty, results[0].id],
            (err2) => {
              if (err2) return res.status(500).json({ error: err2.message });
              res.json({ message: "Cart updated successfully" });
            }
          );
        } else {
          
          db.query(
            "INSERT INTO cart_items (cartId, productId, quantity) VALUES (?, ?, ?)",
            [cart.id, productId, quantity],
            (err3) => {
              if (err3) return res.status(500).json({ error: err3.message });
              res.status(201).json({ message: "Product added to cart" });
            }
          );
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFromCart = (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  db.query(
    "SELECT id FROM carts WHERE userId = ? AND status = 'active' LIMIT 1",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: "Cart not found" });

      const cartId = results[0].id;
      db.query(
        "DELETE FROM cart_items WHERE cartId = ? AND productId = ?",
        [cartId, productId],
        (err2, result) => {
          if (err2) return res.status(500).json({ error: err2.message });
          if (result.affectedRows === 0)
            return res.status(404).json({ message: "Item not found in cart" });
          res.json({ message: "Product removed from cart" });
        }
      );
    }
  );
};

export const getCart = (req, res) => {
  const userId = req.user.id;

  const sql = `
        SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
        'name', p.name,
        'quantity', ci.quantity,
        'price', p.price,
        'subtotal', (p.price * ci.quantity)
            )
        ) AS items,
    COALESCE(SUM(p.price * ci.quantity), 0) AS totalPrice
    FROM carts c
    LEFT JOIN cart_items ci ON ci.cartId = c.id  
    LEFT JOIN products p ON p.id = ci.productId AND p.is_deleted = 0
    WHERE c.userId = ? AND c.status = 'active';
  `;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0)
            return res.json({ message: "Cart is empty", items: [], totalPrice: 0 });
        res.json({ CartIteams : results });
    });
};


export const checkoutCart = (req, res) => {
  const userId = req.user.id;

  db.query(
    "UPDATE carts SET status = 'checked_out' WHERE userId = ? AND status = 'active'",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "No active cart found" });
      res.json({ message: "Checkout successful. Cart closed." });
    }
  );
};
