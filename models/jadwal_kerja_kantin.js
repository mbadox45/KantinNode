module.exports = (sequelize, DataTypes) => {
  const JadwalKerjaKantin = sequelize.define('JadwalKerjaKantin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_kantin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_kantin',
        key: 'id'
      }
    },
    shift_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'master_shift',
        key: 'id'
      }
    },
    tanggal_mulai: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tanggal_selesai: {
      type: DataTypes.DATEONLY,
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
    tableName: 'jadwal_kerja_kantin',
    timestamps: false
  });

  JadwalKerjaKantin.associate = function (models) {
    JadwalKerjaKantin.belongsTo(models.UserKantin, {
      foreignKey: 'user_kantin_id',
      as: 'user_kantin'
    });

    JadwalKerjaKantin.belongsTo(models.MasterShift, {
      foreignKey: 'shift_id',
      as: 'shift' // <-- ini yang dibutuhkan
    });
  };

  return JadwalKerjaKantin;
};
