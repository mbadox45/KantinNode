const { JadwalKerjaKantin, UserKantin, MasterShift } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

// GET semua jadwal kerja
exports.getAll = async (req, res) => {
  try {
    const data = await JadwalKerjaKantin.findAll({
      include: [
        { model: UserKantin, as: 'user_kantin' },
        { model: MasterShift, as: 'shift' }
      ]
    });
    res.status(200).json({code: 200, status: true, message: 'Load data successfully', data});
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengambil data', detail: err.message });
  }
};

exports.getByPeriod = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: 'Parameter "start" dan "end" diperlukan dalam query'
      });
    }

    const data = await JadwalKerjaKantin.findAll({
      where: {
        tanggal_mulai: { [Op.lte]: moment(start).format('YYYY-MM-DD') },
        tanggal_selesai: { [Op.gte]: moment(end).format('YYYY-MM-DD') }
      },
      include: [
        { model: UserKantin, as: 'user_kantin' },
        { model: MasterShift, as: 'shift' }
      ],
      order: [['tanggal_mulai', 'ASC']]
    });

    res.status(200).json({
      code: 200,
      status: true,
      message: 'Data jadwal kerja dalam periode berhasil diambil',
      data
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      status: false,
      message: 'Gagal mengambil data berdasarkan periode',
      detail: err.message
    });
  }
};

// GET jadwal kerja berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const data = await JadwalKerjaKantin.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.status(200).json({code: 200, status: true, message: 'Load data successfully', data});
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengambil data', detail: err.message });
  }
};

// POST tambah jadwal kerja
exports.create = async (req, res) => {
  try {
    const { user_kantin_id, shift_id, tanggal_mulai, tanggal_selesai } = req.body;

    // Cek apakah sudah ada jadwal kerja yang overlap untuk user tersebut
    const existing = await JadwalKerjaKantin.findOne({
      where: {
        user_kantin_id,
        [Op.or]: [
          {
            tanggal_mulai: {
              [Op.between]: [tanggal_mulai, tanggal_selesai]
            }
          },
          {
            tanggal_selesai: {
              [Op.between]: [tanggal_mulai, tanggal_selesai]
            }
          },
          {
            [Op.and]: [
              { tanggal_mulai: { [Op.lte]: tanggal_mulai } },
              { tanggal_selesai: { [Op.gte]: tanggal_selesai } }
            ]
          }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: 'User sudah memiliki jadwal kerja yang tumpang tindih pada periode ini',
      });
    }

    // Jika tidak ada konflik, buat jadwal baru
    const data = await JadwalKerjaKantin.create({
      user_kantin_id,
      shift_id,
      tanggal_mulai,
      tanggal_selesai
    });

    res.status(201).json({
      code: 201,
      status: true,
      message: 'Data berhasil ditambahkan',
      data
    });

  } catch (err) {
    res.status(500).json({
      code: 500,
      status: false,
      message: 'Gagal menambah data',
      detail: err.message
    });
  }
};

// Create multiple jadwal kerja (bulk import)
exports.createBulk = async (req, res) => {
  try {
    const dataArray = req.body;

    if (!Array.isArray(dataArray)) {
      return res.status(400).json({ code: 400, status: false, message: 'Data harus berupa array' });
    }

    // Cek konflik jadwal untuk setiap user_id dan periode
    for (const item of dataArray) {
      const { user_kantin_id, tanggal_mulai, tanggal_selesai } = item;

      const conflict = await JadwalKerjaKantin.findOne({
        where: {
          user_kantin_id,
          [Op.or]: [
            {
              tanggal_mulai: {
                [Op.between]: [tanggal_mulai, tanggal_selesai]
              }
            },
            {
              tanggal_selesai: {
                [Op.between]: [tanggal_mulai, tanggal_selesai]
              }
            },
            {
              [Op.and]: [
                { tanggal_mulai: { [Op.lte]: tanggal_mulai } },
                { tanggal_selesai: { [Op.gte]: tanggal_selesai } }
              ]
            }
          ]
        }
      });

      if (conflict) {
        return res.status(409).json({
          code: 409,
          status: false,
          message: `Jadwal konflik ditemukan untuk user_id: ${user_id} antara ${tanggal_mulai} dan ${tanggal_selesai}`,
        });
      }
    }

    const bulk = await JadwalKerjaKantin.bulkCreate(dataArray, {
      validate: true,
    });

    res.status(201).json({
      code: 201,
      status: true,
      message: `${bulk.length} data berhasil diimport`,
      data: bulk,
    });
  } catch (error) {
    console.error('Bulk Create Error:', error);
    res.status(500).json({
      code: 500,
      status: false,
      message: 'Terjadi kesalahan saat mengimport data',
      error: error.message,
    });
  }
};

// PUT update jadwal kerja
exports.update = async (req, res) => {
  try {
    const data = await JadwalKerjaKantin.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ code: 404, status: false, message: 'Data tidak ditemukan' });
    }

    const { user_kantin_id, shift_id, tanggal_mulai, tanggal_selesai } = req.body;

    // Cek apakah ada jadwal lain untuk user yang tumpang tindih, kecuali id yang sedang diupdate
    const existing = await JadwalKerjaKantin.findOne({
      where: {
        id: { [Op.ne]: req.params.id }, // exclude current id
        user_kantin_id,
        [Op.or]: [
          {
            tanggal_mulai: {
              [Op.between]: [tanggal_mulai, tanggal_selesai]
            }
          },
          {
            tanggal_selesai: {
              [Op.between]: [tanggal_mulai, tanggal_selesai]
            }
          },
          {
            [Op.and]: [
              { tanggal_mulai: { [Op.lte]: tanggal_mulai } },
              { tanggal_selesai: { [Op.gte]: tanggal_selesai } }
            ]
          }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: 'User sudah memiliki jadwal kerja lain yang tumpang tindih pada periode ini',
      });
    }

    await data.update({ user_kantin_id, shift_id, tanggal_mulai, tanggal_selesai });
    res.status(200).json({
      code: 200,
      status: true,
      message: 'Data berhasil diupdate',
      data
    });

  } catch (err) {
    res.status(500).json({
      code: 500,
      status: false,
      message: 'Gagal memperbarui data',
      detail: err.message
    });
  }
};

// DELETE jadwal kerja
exports.destroy = async (req, res) => {
  try {
    const data = await JadwalKerjaKantin.findByPk(req.params.id);
    if (!data) return res.status(404).json({ code: 404, status: false, message: 'Data tidak ditemukan' });

    await data.destroy();
    res.status(200).json({ code: 200, status: true, message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal menghapus data', detail: err.message });
  }
};
