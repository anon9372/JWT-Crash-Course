const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const JWT = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const users = require("../models/index")

// SIGNUP
router.post("/signup", [
    check("email", "Please input a valid email")
        .isEmail(),
    check("password", "Please input a password with a min length of 6")
        .isLength({ min: 6 })
], async (req, res) => {
    const { email, password } = req.body;

    // Validate the inputs 
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }

    try {
        const existingUser = await users.findOne({ email: email })
        if (existingUser) {
            return res.status(422).json({
                errors: [
                    {
                        msg: "This user already exists",
                    }
                ]
            })
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const addUser = new users({
                email, password: hashedPassword
            })
            await addUser.save()
            res.status(201).json(addUser)
            console.log('addUser', addUser)

            const token = await JWT.sign({ email }, "nfb32iur32ibfqfvi3vf932bg932g932", { expiresIn: 360000 });
            console.log('token', token)
            res.json({
                token
            })
        }
    }
    catch (err) {
        res.status(404).send(err)
    }

})

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    // Check if user with email exists

    // let user = users.find((user) => {
    //     return user.email === email
    // });

    const existingUser = await users.findOne({ email: email })

    if (!existingUser) {
        return res.status(422).json({
            errors: [
                {
                    msg: "Invalid Credentials",
                }
            ]
        })
    }

    // Check if the password if valid
    let isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
        return res.status(404).json({
            errors: [
                {
                    msg: "Invalid Credentials"
                }
            ]
        })
    }

    // Send JSON WEB TOKEN
    const token = await JWT.sign({ email }, "nfb32iur32ibfqfvi3vf932bg932g932", { expiresIn: 360000 })

    res.json({
        token
    })
})


// ALL USER
router.get("/all", (req, res) => {
    res.json(users)
})

module.exports = router