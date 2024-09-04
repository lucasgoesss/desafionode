const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const MovieNote = require('./MovieNote');

const MovieTag = sequelize.define('MovieTag', {
  name: { type: DataTypes.STRING, allowNull: false },
  note_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'MovieNote', key: 'id' } }
}, {
  timestamps: true,
  tableName: 'MovieTag'
});

module.exports = MovieTag;
