import mongoose from "mongoose";

class dbClient {
  constructor() {
    this.connectDatabase();
  }

  // Open the database connection
  async connectDatabase() {
    try {
      const queryString = `mongodb://localhost:27017/${process.env.USER_DB}`;
      await mongoose.connect(queryString);
      console.log('Connected to the database')
    } catch (error) {
      console.log(error);
    }
  }

  // Close the database connection
  async closeConnect() {
    try {
      await mongoose.disconnect();
      console.log('The database connection is closed');
    } catch (error) {
      console.log('Error closing the connection: ', error);
    }
  }
}

export default new dbClient();