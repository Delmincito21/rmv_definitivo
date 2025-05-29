const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config.js');

const CategoriaProducto = sequelize.define('CategoriaProducto', {
  id_categoria_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_categoria_producto: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    allowNull: true
  }
}, {
  tableName: 'categorias_productos',
  timestamps: false
});

module.exports = CategoriaProducto;
