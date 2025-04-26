const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  // Primary Key
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Tên
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Tuổi
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: false // nếu không dùng createdAt, updatedAt
});

module.exports = User;
