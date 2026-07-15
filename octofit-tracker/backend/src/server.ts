import { app, apiBaseUrl, port } from './app';

app.listen(port, () => {
  console.log(`Octofit Tracker API listening on port ${port}`);
  console.log(`API base URL: ${apiBaseUrl}`);
});
