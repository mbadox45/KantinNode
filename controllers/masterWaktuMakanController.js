const { MasterWaktuMakan } = require('../models');

exports.getAllWaktuMakan = async (req, res) => {
  try {
    const data = await MasterWaktuMakan.findAll();
    res.status(200).json({ code: 200, status: true, message: 'Load data successfully', data });
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengambil data waktu makan', error: err });
  }
};

exports.createWaktuMakan = async (req, res) => {
  try {
    const {sesi, jam_mulai, jam_selesai} = req.body
    const data = await MasterWaktuMakan.create({sesi, jam_mulai, jam_selesai});
    res.status(201).json({ code: 201, status: true, message: 'Jadwal makan berhasil ditambahkan', data});
  } catch (err) {
    res.status(400).json({ code: 400, status: false, message: 'Gagal membuat waktu makan', error: err });
  }
};

exports.updateWaktuMakan = async (req, res) => {
  try {
    const { id } = req.params;
    const {sesi, jam_mulai, jam_selesai} = req.body

    const data = await MasterWaktuMakan.findByPk(id);
    if (!data) {
      return res.status(404).json({ code: 404, status: false, message: 'Data waktu makan tidak ditemukan' });
    }

    await data.update({sesi, jam_mulai, jam_selesai, updated_at:new Date()});

    res.status(200).json({ code: 200, status: true, message: 'Data waktu makan berhasil diperbarui', data: data });
  } catch (err) {
    res.status(400).json({ code: 400, status: false, message: 'Gagal memperbarui waktu makan', error: err.message });
  }
};
