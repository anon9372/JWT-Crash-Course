const express = require("express")
const mongoose = require('mongoose')

const app = express();

app.use(express.json())

app.use('/auth', require("./routes/auth"))
app.use('/posts', require("./routes/posts"))

// Connecting to Mongo Database server
// mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },
//     () => {
//         console.log('Connected to Mongo DB YAY')
//     })
let uri = "mongodb+srv://dev-av:qwerty123@cluster0.szwxyby.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error(err);
    });


app.listen((5500), () => {
    console.log("Listening on port 5500")
})