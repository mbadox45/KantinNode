// controllers/masterKartuController.js

const { MasterKartu } = require('../models');

// GET semua kartu
exports.getAllKartu = async (req, res) => {
  try {
    const data = await MasterKartu.findAll();
    res.status(200).json({ code: 200, status: true, message: 'Load data successfully', data});
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengambil data kartu', error: err });
  }
};

// GET kartu berdasarkan ID
exports.getKartuById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await MasterKartu.findByPk(id);

    if (!data) {
      return res.status(404).json({ code: 404, status: false, message: 'Kartu tidak ditemukan' });
    }

    res.status(200).json({code: 200, status: true, message: 'Load data successfully', data});
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengambil data kartu', error: err });
  }
};

// POST / create kartu baru
exports.createKartu = async (req, res) => {
  try {
    const { nomor_kartu, status, keterangan } = req.body;
    const data = await MasterKartu.create({ nomor_kartu, status, keterangan });

    const io = req.app.get('io');
    if (io) {
      io.emit('kartuCreated', data);
      console.log('Emit kartuCreated berhasil');
    } else {
      console.log('Socket.io tidak tersedia');
    }

    res.status(201).json({ code: 201, status: true, message: 'RFID berhasil ditambahkan', data });
  } catch (err) {
    res.status(400).json({ code: 400, status: false, message: 'Gagal membuat kartu', error: err.message });
  }
};

// PUT / update data kartu
exports.updateKartu = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomor_kartu, status, keterangan } = req.body;
    const kartu = await MasterKartu.findByPk(id);

    if (!kartu) {
      return res.status(404).json({ code: 404, status: false, message: 'Kartu tidak ditemukan' });
    }

    // Update data sekaligus updated_at
    await kartu.update({
      nomor_kartu,
      status,
      keterangan,
      updated_at: new Date() // manual update
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('kartuUpdated', kartu);
    }

    res.status(200).json({ code: 200, status: true, message: 'Data kartu berhasil diperbarui', kartu });
  } catch (err) {
    res.status(400).json({ code: 400, status: false, message: 'Gagal memperbarui kartu', error: err.message });
  }
};
