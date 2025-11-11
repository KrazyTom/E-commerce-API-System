import db from '../config/db.js';


export const placeOrder = async (req, res) => {
  const userId = req.user.id;

  try {

    const [cartRows] = await db.promise().query(
      `SELECT c.id AS cartId,ci.id as itemId, p.id AS productId, p.name, p.stockQuantity, p.price, ci.quantity, (p.price * ci.quantity) AS subtotal
       FROM carts c
       JOIN cart_items ci ON ci.cartId = c.id and is_deleted = 0
       JOIN products p ON ci.productId = p.id
       WHERE c.userId = ? AND c.status = 'active' AND p.is_deleted = 0`,
      [userId]
    );
    console.log(cartRows);
    if (cartRows.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    for (const item of cartRows) {

        if (item.stockQuantity < item.quantity) { 

            console.log('inside if')
            await db.promise().query(`UPDATE cart_items SET is_deleted = 1 WHERE id = ? AND productId = ?`,[item.itemId, item.productId]);

            return res.status(400).json({
              message: `Product '${item.name}' is out of stock. Removed from cart.`,
            });
         }
     }


    console.log(cartRows);
    await db.promise().query(`UPDATE carts SET status = 'checked_out' WHERE id = ? AND status = 'active'`, [cartRows?.[0]?.cartId]);

    const totalAmount = cartRows.reduce((sum = 0.0, i) => sum + parseFloat(i.subtotal), 0);

    const [orderResult] = await db.promise().query(
      "INSERT INTO orders (userId, totalAmount, status) VALUES (?, ?, 'completed')",
      [userId, totalAmount]
    );

    const orderId = orderResult.insertId;

    for (const item of cartRows) {
        await db.promise().query(
        "INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.productId, item.quantity, item.price]
      );

      await db.promise().query(
        "UPDATE products SET stockQuantity = stockQuantity - ? WHERE id = ? and is_deleted = 0",
        [item.quantity, item.productId]
      );
    }

    await db.promise().query(
      "UPDATE carts SET status = 'checked_out' WHERE id = ?",
      [cartRows[0].cartId]
    );

    res.status(201).json({
      message: "Order placed successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const [orders] = await db.promise().query(
      `SELECT o.id AS orderId, o.totalAmount, o.status, o.createdAt,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'productId', oi.productId,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'subtotal', oi.subtotal
                )
              ) AS items
       FROM orders o
       JOIN order_items oi ON o.id = oi.orderId
       WHERE o.userId = ?
       GROUP BY o.id
       ORDER BY o.createdAt DESC`,
      [userId]
    );

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.promise().query(
      `SELECT o.id AS orderId, u.email AS customerEmail, o.totalAmount, o.status, o.createdAt,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'productId', oi.productId,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'subtotal', oi.subtotal
                )
              ) AS items
       FROM orders o
       JOIN users u ON o.userId = u.id
       JOIN order_items oi ON o.id = oi.orderId
       GROUP BY o.id
       ORDER BY o.createdAt DESC`
    );

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
