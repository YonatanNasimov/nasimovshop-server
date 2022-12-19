const router = require("express").Router();
const nodemailer = require('nodemailer');

router.get("/", (req, res) => {
    res.json({ msg: "sendemail work..." })
});

router.post("/sendemail", (req, res) => {
    let { msg } = req.body
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'nasimovshop123@outlook.com',
            pass: 'yonatan123'
        }
    });

    const mailOptions = {
        from: 'nasimovshop123@outlook.com',
        to: 'yonatannasimov@gmail.com',
        subject: 'Sending Email using Node.js',
        text: msg
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json('Email sent: ' + info.response);
        }
    });
});

module.exports = router;