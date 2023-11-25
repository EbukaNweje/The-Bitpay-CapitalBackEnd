const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true, 
  },

  password: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,

  },

  howdoyouhearabout: {
    type: String,
  },
  
  referralCode: {
    type: String,
  },

  token: {
    type: String,
    required: true,
  },

  accountBalance: {
    type: String,
    default: 0.00
  },

  totalInvestment: {
    type: String,
    default: 0.00
  },

  totalProfit: {
    type: String,
    default: 0.00
  },

  bonus: {
    type: String,
    default: 0.00
  },

  tradingAccounts: {
    type: String,
    default: 0.00
  },

  ref: {
    type: String,
    default: 0.00
  },

  
totalDeposit: {
    type: String,
    default: 0.00
  },

totalWithdrawal: {
    type: String,
    default: 0.00
  },

  status: {
    type: Boolean,
    default: false,
  },

  withdrawCode: {
    type: String,
  },

  verify: {
    type: Boolean,
    default: true,
  },

  isAdmin: {
    // Role of user it will be (normal or admin )
    type: Boolean,
    default: false,
  },

}, {timestamps: true});

module.exports = User = mongoose.model('User', UserSchema )

