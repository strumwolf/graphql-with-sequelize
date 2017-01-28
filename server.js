import express from 'express';
import graphHTTP from 'express-graphql';
import schema from './schema';

// Config
const APP_PORT = 3000;

const app = express();

app.use('/graphql', graphHTTP({
  pretty: true,
  graphiql: true,
  schema,
}));

app.listen(APP_PORT, () => {
  console.log(`App listening on http://localhost:${APP_PORT}`);
});
