module.exports = (sequelize, DataTypes) => {
  const MasterKartu = sequelize.define('MasterKartu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nomor_kartu: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT,
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
    tableName: 'master_kartu',
    timestamps: false
  });

  MasterKartu.associate = function (models) {
    MasterKartu.hasOne(models.UserKantin, {
      foreignKey: 'kartu_id',
      as: 'user_kantin'
    });
  };

  return MasterKartu;
};
