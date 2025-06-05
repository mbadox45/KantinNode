// models/ramadhan.js
module.exports = (sequelize, DataTypes) => {
  const Ramadhan = sequelize.define('Ramadhan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tanggal_awal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true
    },
    tanggal_akhir: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true
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
    tableName: 'ramadhan',
    timestamps: false
  });

  return Ramadhan;
};
