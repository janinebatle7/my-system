const express = require('express');
const { pool } = require('../config/db');
const router = express.Router();

// Get all kakanin items
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM kakanin ORDER BY category, name');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single kakanin
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM kakanin WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new kakanin (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, image, category, stock, is_available } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO kakanin (name, description, price, image, category, stock, is_available) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, image, category, stock, is_available]
    );
    res.status(201).json({ success: true, message: 'Kakanin added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update kakanin
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, image, category, stock, is_available } = req.body;
    await pool.execute(
      'UPDATE kakanin SET name = ?, description = ?, price = ?, image = ?, category = ?, stock = ?, is_available = ? WHERE id = ?',
      [name, description, price, image, category, stock, is_available, req.params.id]
    );
    res.json({ success: true, message: 'Kakanin updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete kakanin
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM kakanin WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Kakanin deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
