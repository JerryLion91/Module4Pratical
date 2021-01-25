import mongoose from 'mongoose';

/**
 * create the model
 */
const accountSchema = mongoose.Schema({
  agencia: {
    type: Number,
    require: true,
  },
  conta: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  balance: {
    type: Number,
    min: 0,
  },
});

export const accountModel = mongoose.model('accounts', accountSchema);
