const dotenv = require("dotenv");
dotenv.config({path: './config.env'});

const mongoose = require("mongoose");
const app = require("./app");  

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  )    
  
mongoose.connect(DB)
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => {   
    console.error("Error connecting to MongoDB:", err);
  });

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
