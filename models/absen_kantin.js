module.exports = (sequelize, DataTypes) => {
  const AbsenKantin = sequelize.define('AbsenKantin', {
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
    sesi_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'master_waktu_makan',
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
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    waktu: {
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
    tableName: 'absen_kantin',
    timestamps: false,
    underscored: true
  });

  AbsenKantin.associate = function (models) {
    AbsenKantin.belongsTo(models.UserKantin, {
      foreignKey: 'user_kantin_id',
      as: 'user_kantin'
    });

    AbsenKantin.belongsTo(models.MasterWaktuMakan, {
      foreignKey: 'sesi_id',
      as: 'sesi'
    });

    AbsenKantin.belongsTo(models.MasterShift, {
      foreignKey: 'shift_id',
      as: 'shift'
    });
  };

  return AbsenKantin;
};
