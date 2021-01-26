import mongoose from 'mongoose';

/**
 * create the model
 */
const accountSchema = mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
  },
  conta: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    min: 0,
  },
});

export const accountModel = mongoose.model('accounts', accountSchema);
