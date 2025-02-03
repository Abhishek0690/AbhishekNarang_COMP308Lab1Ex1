const express = require('express');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoute');
const courseRoutes = require('./routes/courseRoute');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use('/api', studentRoutes);
app.use('/api', courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});