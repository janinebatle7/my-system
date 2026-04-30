const express = require('express');
const { pool } = require('../config/db');
const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
    
    // Get items for each order
    for (let order of orders) {
      const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }
    
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get orders by customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC', [req.params.customerId]);
    
    for (let order of orders) {
      const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }
    
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });
    
    const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    orders[0].items = items;
    
    res.json({ success: true, data: orders[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { customer_id, customer_name, customer_phone, customer_address, total_amount, payment_method, reservation_date, notes, items } = req.body;
    
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (customer_id, customer_name, customer_phone, customer_address, total_amount, payment_method, reservation_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [customer_id, customer_name, customer_phone, customer_address, total_amount, payment_method, reservation_date, notes]
    );
    
    const orderId = orderResult.insertId;
    
    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, kakanin_id, kakanin_name, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.kakanin_id, item.kakanin_name, item.quantity, item.unit_price, item.subtotal]
      );
      
      // Deduct stock
      await connection.execute('UPDATE kakanin SET stock = stock - ? WHERE id = ?', [item.quantity, item.kakanin_id]);
    }
    
    await connection.commit();
    res.status(201).json({ success: true, message: 'Order created', orderId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { order_status } = req.body;
    await pool.execute('UPDATE orders SET order_status = ? WHERE id = ?', [order_status, req.params.id]);
    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update payment status
router.put('/:id/payment', async (req, res) => {
  try {
    const { payment_status } = req.body;
    await pool.execute('UPDATE orders SET payment_status = ? WHERE id = ?', [payment_status, req.params.id]);
    res.json({ success: true, message: 'Payment status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
