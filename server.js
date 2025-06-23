require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app'); // ✅ This must be your Express app

// ✅ Make sure `app` is actually an Express instance
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
  });
