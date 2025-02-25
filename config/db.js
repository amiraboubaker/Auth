require ('dotenv').config ();

const mongoose = require ('mongoose');

mongoose
  .connect (process.env.MONGODB_URI)
  .then (() => {
    console.log (
      `✅ MongoDB Connected to database: ${mongoose.connection.name}`
    );
  })
  .catch (err => {
    console.error ('❌ MongoDB Connection Error:', error);
  });
