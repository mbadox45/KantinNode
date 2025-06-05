module.exports = (sequelize, DataTypes) => {
  const LogTappingKartu = sequelize.define('LogTappingKartu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userkantin_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nrk: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    jabatan: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    bagian: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nomor_kartu: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    waktu_tapping: {
      type: DataTypes.TIME,
      allowNull: false
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    sesi: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    shift: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'log_tapping_kartu',
    timestamps: false // timestamps manual via created_at & updated_at
  });

  return LogTappingKartu;
};
