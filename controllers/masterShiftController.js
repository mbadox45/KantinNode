const { MasterShift } = require('../models');

exports.getAllShift = async (req, res) => {
  try {
    const data = await MasterShift.findAll();
    res.status(200).json({code: 200, status: true, message: 'Load data successfully', data});
  } catch (err) {
    res.status(500).json({code: 500, status: false, message: 'Gagal mengambil data shift', error: err });
  }
};

exports.createShift = async (req, res) => {
  try {
    const {nama_shift, jam_mulai, jam_selesai} = req.body
    const data = await MasterShift.create({nama_shift, jam_mulai, jam_selesai});
    res.status(201).json({code: 201, status: true, message: 'Shift berhasil ditambahkan', data});
  } catch (err) {
    res.status(400).json({ code: 400, status: false, message: 'Gagal membuat shift', error: err });
  }
};

exports.updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const {nama_shift, jam_mulai, jam_selesai} = req.body

    // Cari shift berdasarkan ID
    const data = await MasterShift.findByPk(id);
    if (!data) {
      return res.status(404).json({ code: 404, status: false, message: 'Shift tidak ditemukan' });
    }

    // Update data shift
    await data.update({nama_shift, jam_mulai, jam_selesai, updated_at: new Date()});

    res.status(200).json({ code: 200, status: true, message: 'Shift berhasil diperbarui', data });
  } catch (err) {
    res.status(400).json({ code: 400, status: false, message: 'Gagal memperbarui shift', error: err.message });
  }
};
