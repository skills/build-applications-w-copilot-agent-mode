import 'dotenv/config';
import { createApp } from './app.js';
import { apiBaseUrl, apiPort } from './config/urls.js';
import { connectDatabase } from './config/database.js';

await connectDatabase();
const app = createApp();
app.listen(apiPort, () => {
  console.log(`OctoFit API listening at ${apiBaseUrl()}`);
});
