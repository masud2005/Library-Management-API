import 'dotenv/config'
import { Server } from 'http';
import mongoose from "mongoose";
import app from './app';

let server: Server;
const port = 5000;

async function main() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.database_name}:${process.env.database_password}@cluster0.cckud.mongodb.net/libraryManagement?retryWrites=true&w=majority&appName=Cluster0`);

        console.log("Connected to mongoDB using mongoose!");

        server = app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        })

    } catch (error) {
        console.log(error);
    }

}

main();