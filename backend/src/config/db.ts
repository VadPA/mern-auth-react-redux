import mongoose from 'mongoose';

export const connectionDB = () => {
  mongoose
    .connect(process.env.MONGO_URI as string, {
      dbName: 'mern-auth-react-redux',
    })
    .then(() => {
      console.log('Connected to database.');
    })
    .catch((err) => {
      console.log(`An error occurred when connecting to the database: ${err}`);
    });
};

// export const connectDB = async () => {
//   try {
//     const connect = await mongoose.connect(process.env.DB as string, {
//       ssl: true,
//       tls: true,
//     });
//     console.log(`MongoDB connection successfully: ${connect.connection.host}`);
//   } catch (error) {
//     console.log(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };
