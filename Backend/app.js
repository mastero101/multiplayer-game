const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const swaggerSetup = require('./swagger');
const accountRoutes = require('./routes/account');
const playerRoutes = require('./routes/player');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use('/account', accountRoutes);
app.use('/player', playerRoutes);

swaggerSetup(app);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
