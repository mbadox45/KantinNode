const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { generateToken } = require('../utils/jwt');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey'; // Simpan di .env

// Register user baru
exports.register = async (req, res) => {
  try {
    const { name, email, password, status, roles } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({code: 400, message: 'Email sudah terdaftar', status: false });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      status,
      roles
    });

    res.status(201).json({code: 201, status: true, message: 'User berhasil dibuat', user });
  } catch (err) {
    res.status(500).json({code: 500, status: false, message: 'Gagal membuat user', error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ code: 404, status: false, message: 'User tidak ditemukan' });
    
    if (user.status == false) return res.status(401).json({ code: 401, status: false, message: 'User akun nonaktif' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ code: 401, status: false, message: 'Password salah' });

    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };

    const token = generateToken(payload);

    res.status(200).json({ code: 200, status: true, message: 'Login sukses', token, user });
  } catch (error) {
    res.status(500).json({ code: 500, status: false, message: 'Login gagal', error: error.message });
  }
};

// Edit data user (kecuali password)
exports.edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, status, roles } = req.body;

    const data = await User.findByPk(id);
    if (!data) return res.status(404).json({ code: 404, status: false, message: 'User tidak ditemukan' });

    // Update data tanpa password
    await data.update({ name, email, status, roles });

    res.status(200).json({ code: 200, status: true, message: 'Data user berhasil diperbarui', data });
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal memperbarui user', error: err.message });
  }
};

// Update password user (validasi password lama)
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ code: 404, status: false, message: 'User tidak ditemukan' });

    // Validasi password lama
    // const isMatch = await bcrypt.compare(oldPassword, user.password);
    // if (!isMatch) return res.status(400).json({ code: 400, status: false, message: 'Password lama salah' });

    // Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await user.update({ password: hashedPassword });

    res.status(200).json({ code: 200, status: true, message: 'Password berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal memperbarui password', error: err.message });
  }
};

// Get all user
exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.findAll({
      attributes: { exclude: ['password'] } // jangan kirim password
    });
    res.status(200).json({code: 200, status: true, message: 'Load data successfully', data});
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengambil data user', error: err.message });
  }
};
