const mongoose = require('mongoose')

const mainConnect = async () => {
  try {
    mongoose.connect(process.env.MONGODB_ATLAS_URL)
    console.log('Succesfully connected to Mongodb Atlas Server')
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = mainConnect
