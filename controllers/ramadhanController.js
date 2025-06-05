const { Ramadhan } = require('../models');

exports.getAllRamadhan = async (req, res) => {
  try {
    const data = await Ramadhan.findAll();
    res.status(200).json({ code: 200, status: true, message: 'Load data successfully', data});
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengambil data ramadhan', error: err });
  }
};

exports.createRamadhan = async (req, res) => {
  try {
    const {nama, tanggal_awal, tanggal_akhir} = req.body
    const data = await Ramadhan.create({nama, tanggal_awal, tanggal_akhir});
    res.status(201).json({ code: 201, status: true, message: 'Periode puasa berhasil ditambahkan', data});
  } catch (err) {
    res.status(400).json({ code: 400, status: false, message: 'Gagal membuat data ramadhan', error: err });
  }
};

exports.updateRamadhan = async (req, res) => {
  try {
    const { id } = req.params;
    const {nama, tanggal_awal, tanggal_akhir} = req.body

    const data = await Ramadhan.findByPk(id);
    if (!data) {
      return res.status(404).json({ code: 404, status: false, message: 'Data Ramadhan tidak ditemukan' });
    }

    await data.update({nama, tanggal_awal, tanggal_akhir, updated_at:new Date()});

    res.json({ code: 201, status: true,  message: 'Data Ramadhan berhasil diperbarui', data });
  } catch (err) {
    res.status(400).json({ code: 400, status: false, message: 'Gagal memperbarui data Ramadhan', error: err.message });
  }
};
