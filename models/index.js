const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema(
    {

        email: {
            type: String,
            require: true,
            max: 20,
            unique: true
        },
        password: {
            type: String,
            require: true,
            min: 4,
            unique: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("users", usersSchema)