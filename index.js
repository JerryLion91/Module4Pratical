import express from 'express';
import mongoose from 'mongoose';
import { accountModel } from './models/accountModel';

/**
 *  ✓1. Criar DB no mongoDB Atlas
 *  2. Implementar um Schema, todos campo required, balance > 0
 *  3. Criar project my-bank-api para implantacao dos endpoints
 */

mongoose
  .connect(
    'mongodb+srv://jerry-lion:LVbunezURYD3UiHB@cluster0.qucph.mongodb.net/praticalWork?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected to Mongo');
  })
  .catch((err) => {
    console.error(`Error to connect to Mongo: ${err}`);
  });

const app = express();
app.use(express.json());
app.use('/account', accountModel);

app.listen(8080, () => {
  console.log('API started');
});
