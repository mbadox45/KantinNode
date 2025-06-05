module.exports = (sequelize, DataTypes) => {
  const MasterWaktuMakan = sequelize.define('MasterWaktuMakan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sesi: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    jam_mulai: {
      type: DataTypes.TIME,
      allowNull: false
    },
    jam_selesai: {
      type: DataTypes.TIME,
      allowNull: false
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
    tableName: 'master_waktu_makan',
    timestamps: false
  });

  return MasterWaktuMakan;
};
