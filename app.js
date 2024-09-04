const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const sequelize = require('./database');
const User = require('./models/User');
const MovieNote = require('./models/MovieNote');
const MovieTag = require('./models/MovieTag');

// Initialize Express app
const app = express();
app.use(express.json());

// Define Associations
User.hasMany(MovieNote, { foreignKey: 'user_id' });
MovieNote.belongsTo(User, { foreignKey: 'user_id' });

MovieNote.hasMany(MovieTag, { foreignKey: 'note_id', onDelete: 'CASCADE' });
MovieTag.belongsTo(MovieNote, { foreignKey: 'note_id' });

// User Registration Route
app.post('/users', async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    avatar: Joi.string().optional(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, email, password, avatar } = value;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, avatar });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Movie Note Route
app.post('/movies', async (req, res) => {
  const { title, description, rating, user_id, tags } = req.body;

  try {
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const movie = await MovieNote.create({ title, description, rating, user_id });

    if (tags && tags.length > 0) {
      const movieTags = tags.map(tag => ({ name: tag, note_id: movie.id }));
      await MovieTag.bulkCreate(movieTags);
    }

    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Movie Notes
app.get('/movies', async (req, res) => {
  try {
    const movies = await MovieNote.findAll({ include: [MovieTag] });
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Movie Note Route
app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, rating } = req.body;

  try {
    const movie = await MovieNote.findByPk(id);
    if (!movie) return res.status(404).json({ error: 'Movie note not found.' });

    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.rating = rating || movie.rating;
    await movie.save();

    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Movie Note Route
app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await MovieNote.findByPk(id);
    if (!movie) return res.status(404).json({ error: 'Movie note not found.' });

    await movie.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Tags for a Movie Note
app.get('/movies/:id/tags', async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await MovieNote.findByPk(id, { include: [MovieTag] });
    if (!movie) return res.status(404).json({ error: 'Movie note not found.' });

    res.status(200).json(movie.MovieTags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a Tag to a Movie Note
app.post('/movies/:id/tags', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const movie = await MovieNote.findByPk(id);
    if (!movie) return res.status(404).json({ error: 'Movie note not found.' });

    const tag = await MovieTag.create({ name, note_id: movie.id });
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Tag from a Movie Note
app.delete('/movies/:movieId/tags/:tagId', async (req, res) => {
  const { movieId, tagId } = req.params;

  try {
    const tag = await MovieTag.findOne({ where: { id: tagId, note_id: movieId } });
    if (!tag) return res.status(404).json({ error: 'Tag not found.' });

    await tag.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }) // Set to true for development; change to false to avoid data loss
  .then(() => {
    console.log('Database synchronized');
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch(err => {
    console.error('Unable to synchronize the database:', err);
  });