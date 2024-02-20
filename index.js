const express = require('express')
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')


let user = {
    id: "ljdlfsf",
    email: "kaif@gmail.com",
    password: "lajsdlkfjsd"
}

const JWT_SECRET = "super secret"

app.get("/", (req, res) => {
    res.send("Hello world")
})


app.get("/forgot-password", (req, res) => {
    res.render("forgot-password")
})

app.post("/forgot-password", (req, res) => {
    const { email } = req.body
    if (user.email !== email) {
        res.send("User not registered")
        return
    }

    // since now that the user exists we need to send a verification link to user valid for 15 minutes or so

    const SECRET = JWT_SECRET + user.password
    const payload = { email: user.email, id: user.id }

    const token = jwt.sign(payload, SECRET, { expiresIn: "15m" })

    res.send(`http://localhost:3000/reset-password/${user.id}/${token}`)
    console.log(`http://localhost:3000/reset-password/${user.id}/${token}`)
})

app.get("/reset-password/:id/:token", (req, res) => {
    const { id, token } = req.params

    if (user.id !== id) {
        res.send("User not registered")
        return
    }

    const SECRET = JWT_SECRET + user.password
    try {
        const payload = jwt.verify(token, SECRET)
        res.render("reset-password", { email: user.email })

    } catch (error) {
        res.send({ error })
    }
})

app.post("/reset-password/:id/:token", (req, res) => {
    const { id, token } = req.params
    const { password, confirm_password } = req.body

    if (!user.id === id) {
        res.send("Invalid id")
        return
    }

    const secret = JWT_SECRET + user.password
    try {
        const payload = jwt.verify(token, secret)
        if (password != confirm_password) {
            res.send("Please enter the same password in both input fields")
            return;
        }
        user.password = password
        res.send("password has been reset")
        return
    } catch (error) {
        res.send("Invalid token")
        retrun
    }

})

app.listen(3000, () => {
    console.log('server has started on port 3000')
})