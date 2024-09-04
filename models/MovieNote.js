const { DataTypes } = require('sequelize');
const sequelize = require('../database'); 
const User = require('./User'); 
const MovieTag = require('./MovieTag'); 

const MovieNote = sequelize.define('MovieNote', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } }
}, {
  timestamps: true,
  tableName: 'MovieNote',
  freezeTableName: true 
});

User.hasMany(MovieNote, { foreignKey: 'user_id' });
MovieNote.belongsTo(User, { foreignKey: 'user_id' });

MovieNote.hasMany(MovieTag, { foreignKey: 'note_id', onDelete: 'CASCADE' });
MovieTag.belongsTo(MovieNote, { foreignKey: 'note_id' });

module.exports = MovieNote;
