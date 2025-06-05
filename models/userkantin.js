module.exports = (sequelize, DataTypes) => {
  const UserKantin = sequelize.define('UserKantin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    kartu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'master_kartu',
        key: 'id'
      }
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
    tableName: 'user_kantin',
    timestamps: false
  });

  UserKantin.associate = function (models) {
    UserKantin.belongsTo(models.MasterKartu, {
      foreignKey: 'kartu_id',
      as: 'kartu'
    });

    UserKantin.hasMany(models.JadwalKerjaKantin, {
      foreignKey: 'user_kantin_id',
      as: 'jadwal_kerja_kantins'  // agar method `getJadwal_kerja_kantins()` tersedia
    });
  };

  return UserKantin;
};
