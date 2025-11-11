import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { generateToken } from '../utils/token.js';

export const register = (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (results.length > 0)
      return res.status(400).json({ message: 'Email already exists' });

    db.query(
      'INSERT INTO users (name, email, password, role,is_deleted) VALUES (?, ?, ?, ?,?)',
      [name, email, hashedPassword, role || 'customer',0],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ? and is_deleted = 0', [email], (err, results) => {
    if (results.length === 0)
      return res.status(400).json({ message: 'Invalid credentials' });

    const user = results[0];
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ message: 'Login successful', token });
  });
};

export const getProfile = (req, res) => {
  res.json({ message: 'User profile', user: req.user });
};
