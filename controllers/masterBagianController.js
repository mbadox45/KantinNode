const { MasterBagian } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await MasterBagian.findAll();
    res.status(200).json({ code: 200, status: true, message: 'Data berhasil diambil', data });
  } catch (error) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengambil data', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await MasterBagian.findByPk(id);
    if (!data) {
      return res.status(404).json({ code: 404, status: false, message: 'Data tidak ditemukan' });
    }
    res.status(200).json({ code: 200, status: true, message: 'Data ditemukan', data });
  } catch (error) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengambil data', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama } = req.body;

    // Cek duplikasi
    const existing = await MasterBagian.findOne({ where: { nama } });
    if (existing) {
      return res.status(400).json({ code: 400, status: false, message: 'Nama bagian sudah ada.' });
    }

    const data = await MasterBagian.create({ nama });
    res.status(201).json({ code: 201, status: true, message: 'Data berhasil ditambahkan', data });
  } catch (error) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal menambahkan data', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;

    const data = await MasterBagian.findByPk(id);
    if (!data) {
      return res.status(404).json({ code: 404, status: false, message: 'Data tidak ditemukan' });
    }

    // Cek nama baru apakah sudah ada di entri lain
    const duplicate = await MasterBagian.findOne({ where: { nama } });
    if (duplicate && duplicate.id !== parseInt(id)) {
      return res.status(400).json({ code: 400, status: false, message: 'Nama bagian sudah digunakan.' });
    }

    await data.update({ nama, updated_at: new Date() });
    res.status(200).json({ code: 200, status: true, message: 'Data berhasil diupdate', data });
  } catch (error) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengupdate data', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await MasterBagian.findByPk(id);
    if (!data) {
      return res.status(404).json({ code: 404, status: false, message: 'Data tidak ditemukan' });
    }

    await data.destroy();
    res.status(200).json({ code: 200, status: true, message: 'Data berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal menghapus data', error: error.message });
  }
};
