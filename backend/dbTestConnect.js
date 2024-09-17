const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongod = null
const connectDB = async () => {
  try {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
    await mongoose.connect(uri, mongooseOpts)
  } catch (err) {
    console.log(err.message)
  }
}

const closeConnection = async () => {
  try {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongod.stop()
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = { connectDB, closeConnection }
