const mongoose = require("mongoose")


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
    })
    console.log(`MongoDB Connected`.cyan.underline.bold)
  }
  catch (err) {
    console.error(err)
  }


}

module.exports = connectDB