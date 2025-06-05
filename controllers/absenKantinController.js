const { AbsenKantin, UserKantin, MasterKartu, MasterShift, MasterWaktuMakan, Ramadhan, LogTappingKartu  } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

exports.tapAbsen = async (req, res) => {
  try {
    const { rfid } = req.body;
    const now = moment();

    // 1. Validasi kartu
    const kartu = await MasterKartu.findOne({
      where: { nomor_kartu: rfid, status: true },
      include: [{ model: UserKantin, as: 'user_kantin' }]
    });

    if (!kartu || !kartu.user_kantin) {
      return res.status(404).json({ code: 400, status: false, message: 'Kartu tidak valid atau tidak terdaftar.' });
    }

    const userKantin = kartu.user_kantin;

    // 2. Cek apakah hari ini termasuk Ramadhan
    const periodeRamadhan = await Ramadhan.findOne({
      where: {
        tanggal_awal: { [Op.lte]: now.toDate() },
        tanggal_akhir: { [Op.gte]: now.toDate() }
      }
    });

    const isRamadhan = !!periodeRamadhan;

    // 3. Cari sesi aktif
    const waktuSesi = await MasterWaktuMakan.findAll();
    let sesiAktif = null;

    for (const sesi of waktuSesi) {
      let jamMulai = moment(sesi.jam_mulai, 'HH:mm');
      let jamSelesai = moment(sesi.jam_selesai, 'HH:mm');

      if (isRamadhan) {
        if (sesi.id === 1) {
          jamSelesai = moment('17:00', 'HH:mm'); // Perubahan sesi 1
        } else if (sesi.id === 3) {
          // Sesi 3 gabungan 2 rentang waktu
          const rentang1Mulai = moment('22:45', 'HH:mm');
          const rentang1Selesai = moment('23:59:59', 'HH:mm');
          const rentang2Mulai = moment('00:00', 'HH:mm');
          const rentang2Selesai = moment('05:00', 'HH:mm');

          const sekarang = moment(now.format('HH:mm'), 'HH:mm');
          const diRentang1 = sekarang.isBetween(rentang1Mulai, rentang1Selesai);
          const diRentang2 = sekarang.isBetween(rentang2Mulai, rentang2Selesai);

          if (diRentang1 || diRentang2) {
            sesiAktif = sesi;
            break;
          } else {
            continue;
          }
        }
      }

      // Cek sesi aktif biasa
      if (now.isBetween(jamMulai, jamSelesai)) {
        sesiAktif = sesi;
        break;
      }
    }

    if (!sesiAktif) {
      return res.status(400).json({ code: 400, status: false, message: 'Tidak ada sesi makan aktif saat ini.' });
    }

    // 4. Cek shift user hari ini
    const jadwalShift = await userKantin.getJadwal_kerja_kantins({
      where: {
        tanggal_mulai: { [Op.lte]: now.toDate() },
        tanggal_selesai: { [Op.gte]: now.toDate() }
      },
      include: ['shift']
    });

    if (!jadwalShift || !jadwalShift.length) {
      return res.status(400).json({ code: 400, status: false, message: 'User tidak memiliki jadwal shift hari ini.' });
    }

    const shiftAktif = jadwalShift[0].shift;

    // 5. Cek apakah sudah absen
    const sudahAbsen = await LogTappingKartu.findOne({
      where: {
        userkantin_id: userKantin.id,
        tanggal: now.format('YYYY-MM-DD'),
        sesi: sesiAktif.sesi
      }
    });

    if (sudahAbsen) {
      return res.status(400).json({ code: 400, status: false, message: 'Sudah tapping pada sesi ini.' });
    }

    // 6. Simpan absen
    // const absen = await AbsenKantin.create({
    //   user_kantin_id: userKantin.id,
    //   sesi_id: sesiAktif.id,
    //   shift_id: shiftAktif.id,
    //   tanggal: now.format('YYYY-MM-DD'),
    //   waktu: now.format('HH:mm:ss')
    // });

    // 🔸 Simpan log tapping
    const absen = await LogTappingKartu.create({
      userkantin_id: userKantin.id,
      nrk: userKantin.nrk,
      nama: userKantin.nama,
      jabatan: userKantin.jabatan,
      bagian: userKantin.bagian,
      nomor_kartu: kartu.nomor_kartu,
      waktu_tapping: now.format('HH:mm:ss'),
      tanggal: now.format('YYYY-MM-DD'),
      sesi: sesiAktif.sesi,
      shift: shiftAktif.nama_shift,
      created_at: now.toDate(),
      updated_at: now.toDate()
    });

    // 7. Emit ke WebSocket
    const io = req.io;
    io.emit('absenKantin:created', {
      message: 'Absen berhasil',
      absen
    });

    return res.status(201).json({ code: 201, status: true, message: 'Absen berhasil', absen });

  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, status: false, message: 'Terjadi kesalahan', detail: error.message });
  }
};

exports.getAllAbsenKantin = async (req, res) => {
  try {
    const { tanggal_awal, tanggal_akhir } = req.query;

    // Validasi input
    if (!tanggal_awal || !tanggal_akhir) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: 'Parameter tanggal_awal dan tanggal_akhir wajib diisi'
      });
    }

    const data = await LogTappingKartu.findAll({
      where: {
        tanggal: {
          [Op.between]: [tanggal_awal, tanggal_akhir]
        }
      },
      order: [['tanggal', 'DESC'], ['waktu_tapping', 'DESC']]
    });

    res.status(200).json({ code: 200, status: true, message: 'Load data successfully', data });

  } catch (error) {
    console.error('Gagal mengambil data view absen:', error);
    res.status(500).json({ code: 500, status: false, message: 'Gagal mengambil data', detail: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await AbsenKantin.findAll({
      include: ['user_kantin', 'sesi', 'shift']
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data', detail: err.message });
  }
};

exports.getByPeriod = async (req, res) => {
  try {
    const { start_date, end_date, user_kantin_id } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'Parameter start_date dan end_date wajib diisi' });
    }

    const whereClause = {
      tanggal: {
        [Op.between]: [start_date, end_date]
      }
    };

    if (user_kantin_id) {
      whereClause.user_kantin_id = user_kantin_id;
    }

    const data = await AbsenKantin.findAll({
      where: whereClause,
      include: ['user_kantin', 'sesi', 'shift'],
      order: [['tanggal', 'ASC'], ['waktu', 'ASC']]
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data per periode', detail: err.message });
  }
};
