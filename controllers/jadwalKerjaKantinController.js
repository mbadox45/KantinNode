const { JadwalKerjaKantin, UserKantin, MasterShift } = require('../models');

// GET semua jadwal kerja
exports.getAll = async (req, res) => {
  try {
    const data = await JadwalKerjaKantin.findAll({
      include: [
        { model: UserKantin, as: 'user_kantin' },
        { model: MasterShift, as: 'shift' }
      ]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data', detail: err.message });
  }
};

// GET jadwal kerja berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const data = await JadwalKerjaKantin.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data', detail: err.message });
  }
};

// POST tambah jadwal kerja
exports.create = async (req, res) => {
  try {
    const { user_kantin_id, shift_id, tanggal_mulai, tanggal_selesai } = req.body;
    const newData = await JadwalKerjaKantin.create({
      user_kantin_id,
      shift_id,
      tanggal_mulai,
      tanggal_selesai
    });
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ error: 'Gagal menambahkan data', detail: err.message });
  }
};

// Create multiple jadwal kerja (bulk import)
exports.createBulk = async (req, res) => {
  try {
    const dataArray = req.body; // pastikan req.body adalah array of object
    if (!Array.isArray(dataArray)) {
      return res.status(400).json({ message: 'Data harus berupa array' });
    }

    const bulk = await JadwalKerjaKantin.bulkCreate(dataArray, {
      validate: true, // agar validasi model tetap dijalankan
    });

    res.status(201).json({
      message: `${bulk.length} data berhasil diimport`,
      data: bulk,
    });
  } catch (error) {
    console.error('Bulk Create Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengimport data', error });
  }
};

// PUT update jadwal kerja
exports.update = async (req, res) => {
  try {
    const data = await JadwalKerjaKantin.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'Data tidak ditemukan' });

    const { user_kantin_id, shift_id, tanggal_mulai, tanggal_selesai } = req.body;
    await data.update({ user_kantin_id, shift_id, tanggal_mulai, tanggal_selesai });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: 'Gagal memperbarui data', detail: err.message });
  }
};

// DELETE jadwal kerja
exports.destroy = async (req, res) => {
  try {
    const data = await JadwalKerjaKantin.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus data', detail: err.message });
  }
};
