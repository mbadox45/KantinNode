const { Visitor } = require('../models');
const { Op } = require('sequelize');


// Get all visitors
exports.getAllVisitors = async (req, res) => {
  try {
    const data = await Visitor.findAll();
    res.status(200).json({code: 200, status: true, message: 'Load data successfully', data});
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengambil data visitor', error: err.message });
  }
};

// Create new visitor
exports.createVisitor = async (req, res) => {
  try {
    const {nama, institusi, tanggal_kunjungan, keperluan, total} = req.body
    const data = await Visitor.create({nama, institusi, tanggal_kunjungan, keperluan, total});
    res.status(201).json({code: 201, status: true, message: 'Visitor berhasil ditambahkan', data});
  } catch (err) {
    res.status(400).json({ code: 400, status: false, message: 'Gagal membuat visitor', error: err.message });
  }
};

// Update visitor
exports.updateVisitor = async (req, res) => {
  try {
    const id = req.params.id;
    const {nama, institusi, tanggal_kunjungan, keperluan, total} = req.body
    const [updated] = await Visitor.update({nama, institusi, tanggal_kunjungan, keperluan, total, updated_at: new Date()}, { where: { id } });
    if (updated) {
      const data = await Visitor.findByPk(id);
      res.status(200).json({code: 200, status: true, message: 'Visitor berhasil diupdate', data});
    } else {
      res.status(404).json({ code: 404, status: false, message: 'Visitor tidak ditemukan' });
    }
  } catch (err) {
    res.status(400).json({ code: 400, status: false, message: 'Gagal memperbarui visitor', error: err.message });
  }
};

// Get visitor by ID
exports.getVisitorById = async (req, res) => {
  try {
    const data = await Visitor.findByPk(req.params.id);
    if (data) {
      res.status(200).json({ code: 200, status: true, message: 'Load data successfully', data});
    } else {
      res.status(404).json({ code: 404, status: false, message: 'Visitor tidak ditemukan' });
    }
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengambil data visitor', error: err.message });
  }
};

// Get visitors by date range (periode)
exports.getVisitorsByPeriod = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ 
        code: 400, 
        status: false, 
        message: 'Parameter start_date dan end_date wajib diisi.' 
      });
    }

    const data = await Visitor.findAll({
      where: {
        tanggal_kunjungan: {
          [Op.between]: [start_date, end_date]
        }
      },
      order: [['tanggal_kunjungan', 'ASC']]
    });

    res.status(200).json({
      code: 200,
      status: true,
      message: `Data visitor dari ${start_date} sampai ${end_date} berhasil dimuat.`,
      data
    });
  } catch (err) {
    res.status(500).json({ 
      code: 500, 
      status: false, 
      message: 'Gagal mengambil data visitor berdasarkan periode', 
      error: err.message 
    });
  }
};


// Delete visitor
exports.deleteVisitor = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Visitor.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ code: 200, status: true, message: 'Visitor berhasil dihapus' });
    } else {
      res.status(404).json({ code: 404, status: false, message: 'Visitor tidak ditemukan' });
    }
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal menghapus visitor', error: err.message });
  }
};
