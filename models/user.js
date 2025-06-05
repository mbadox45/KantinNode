module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      roles: {
        type: DataTypes.STRING(20),
        allowNull: false // contoh: 'administrator', 'views'
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
      tableName: 'users',
      timestamps: false // kita handle manual via created_at dan updated_at
    });
  
    return User;
};