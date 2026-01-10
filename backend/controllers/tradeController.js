const db = require('../config/db');

// GET all trades - User sees their own, Admin sees all 
exports.getTrades = async (req, res) => {
    try {
        let query = 'SELECT * FROM trades';
        let params = [];

        if (req.user.role !== 'admin') {
            query += ' WHERE user_id = ?';
            params.push(req.user.id);
        }

        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// POST new trade with input validation 
exports.createTrade = async (req, res) => {
    const { asset_name, trade_type, amount, price } = req.body;
    
    if (!asset_name || !amount || !price) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        await db.query(
            'INSERT INTO trades (asset_name, trade_type, amount, price, user_id) VALUES (?, ?, ?, ?, ?)',
            [asset_name, trade_type, amount, price, req.user.id]
        );
        res.status(201).json({ message: "Trade executed" });
    } catch (error) {
        res.status(500).json({ message: "Database error" });
    }
};

// DELETE trade - Admin restriction logic 
exports.deleteTrade = async (req, res) => {
    try {
        // Simple logic: Admins can delete anything; users can't delete (or only their own)
        const [trade] = await db.query('SELECT * FROM trades WHERE id = ?', [req.params.id]);
        
        if (req.user.role !== 'admin' && trade[0].user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this record" });
        }

        await db.query('DELETE FROM trades WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: "Record deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};