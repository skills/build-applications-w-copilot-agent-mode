"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'connection error:'));
async function connectToDatabase() {
    if (db.readyState === 1) {
        return db;
    }
    try {
        await mongoose_1.default.connect(connectionString);
        console.log('Connected to octofit_db');
        return db;
    }
    catch (error) {
        console.warn('Unable to connect to octofit_db; API routes will fall back to sample data.', error);
        return db;
    }
}
exports.default = db;
