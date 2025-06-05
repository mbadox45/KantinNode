module.exports = (sequelize, DataTypes) => {
  const MasterShift = sequelize.define('MasterShift', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_shift: {
      type: DataTypes.STRING(20),
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
    tableName: 'master_shift',
    timestamps: false
  });

  return MasterShift;
};
