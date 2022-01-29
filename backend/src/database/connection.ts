import "dotenv/config";

import CONFIG from "../config";

import mongoose from "mongoose";
const connection = mongoose.connect(CONFIG.CONNECTION_STRING);
export {connection, mongoose};
