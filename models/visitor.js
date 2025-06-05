module.exports = (sequelize, DataTypes) => {
  const Visitor = sequelize.define('Visitor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    institusi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tanggal_kunjungan: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    keperluan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: 'visitors',
    timestamps: false
  });

  return Visitor;
};
