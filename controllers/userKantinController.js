const { UserKantin, MasterKartu } = require('../models');

exports.getAllUserKantin = async (req, res) => {
  try {
    const data = await UserKantin.findAll({
      include: [
        {
          model: MasterKartu,
          as: 'kartu', // sesuai alias relasi yang didefinisikan
          attributes: ['id', 'nomor_kartu', 'status'] // ambil kolom yang diinginkan
        }
      ]
    });
    res.status(200).json({ code: 200, status: true, message: 'Load data successfully', data });
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengambil data user kantin', error: err });
  }
};

exports.cekKartu = async (req, res) => {
  try {
    const { nomor_kartu } = req.body;

    const kartu = await MasterKartu.findOne({
      where: { nomor_kartu },
      include: {
        model: UserKantin,
        as: 'user_kantin' // karena pakai hasOne
      }
    });

    if (!kartu) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: 'Kartu tidak ditemukan.'
      });
    }

    const digunakan = !!kartu.user_kantin;

    return res.status(200).json({
      code: 200,
      status: true,
      message: 'Kartu ditemukan.',
      data: {
        id: kartu.id,
        nomor_kartu: kartu.nomor_kartu,
        status_kartu: kartu.status,
        digunakan_oleh_user: digunakan,
        user_kantin: kartu.user_kantin ?? null
      }
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: false,
      message: 'Terjadi kesalahan saat pengecekan kartu.',
      error: error.message
    });
  }
};


exports.createUserKantin = async (req, res) => {
  try {
    const { nama, bagian, jabatan, kartu_id, nrk } = req.body;

    // Cek apakah kartu_id sudah digunakan
    const existingUser = await UserKantin.findOne({ where: { kartu_id } });
    if (existingUser) {
      return res.status(409).json({
        code: 409,
        status: false,
        message: 'Kartu ID sudah digunakan oleh user lain',
      });
    }

    const data = await UserKantin.create({ nama, bagian, jabatan, kartu_id, nrk });
    res.status(201).json({
      code: 201,
      status: true,
      message: 'User kantin berhasil ditambahkan',
      data
    });
  } catch (err) {
    res.status(400).json({
      code: 400,
      status: false,
      message: 'Gagal membuat user kantin',
      error: err.message
    });
  }
};


exports.updateUserKantin = async (req, res) => {
  try {
    const { id } = req.params;
    const {nama, bagian, jabatan, kartu_id, nrk} = req.body
    const user = await UserKantin.findByPk(id);

    if (!user) {
      return res.status(404).json({ code: 404, status: false, message: 'User kantin tidak ditemukan' });
    }

    await user.update({nama, bagian, jabatan, kartu_id, nrk, updated_at:new Date()});
    res.status(200).json({ code: 200, status: true, message: 'User kantin berhasil diperbarui', data: user });
  } catch (err) {
    res.status(400).json({ code: 400, status: false, message: 'Gagal memperbarui user kantin', error: err.message });
  }
};

exports.deleteUserKantin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserKantin.findByPk(id);
    if (!user) {
      return res.status(404).json({ code: 404, status: false, message: 'User kantin tidak ditemukan' });
    }

    await user.destroy();
    res.status(200).json({ code: 200, status: true, message: 'User kantin berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: 'Gagal menghapus user kantin', error: err.message });
  }
};