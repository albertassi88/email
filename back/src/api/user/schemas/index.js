const mongoose = require('mongoose')

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  cnpjCpf: {
    type: String,
    required: true,
    unique: true, 
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
  passwordRepeat: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  dateRegister: {
    type: Date,
    required: true,
  },
  clients: [
    {
      name: {
        type: String,
      },
      company: {
        type: String,
        required: true,
      },
      cnpjCpf: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      upload: [
        {
          vencimento: {
            type: String,
          },
          path: {
            type: String,
          },
          status: {
            type: Boolean,
          },
          statusVarios: {
            type: Boolean,
          },
          statusAmanha: {
            type: Boolean,
          },
          statusHoje: {
            type: Boolean,
          }
        }
      ]
    }
  ]
})

module.exports = User;

