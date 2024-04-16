// userController.js

const User = require('../models/User.js');

exports.showLoginPage = (req, res) => {
    res.render('login');
};

exports.showRegisterPage = (req, res) => {
    res.render('register');
};

exports.registerUser = async (req, res) => {
    const { name, email } = req.body;

    // Checking for errors
    let errors = [];

    if (!name || !email) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
        res.render('register', { errors, name, email });
    } else {
        try {
            // Validation Passed
            const user = await User.findOne({ email: email });
            if (user) {
                errors.push({ msg: 'Email ID already exists' });
                res.render('register', { errors, name, email });
            } else {
                const newUser = new User({ name, email });
                await newUser.save();
                req.flash('success_msg', 'You are now registered. Please log in');
                res.redirect('/users/login');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
};

exports.loginUser = async (req, res) => {
    const { email } = req.body;
    console.log(email)
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            let errors = [];
            errors.push({ msg: 'This email is not registered' });
            res.render('login', { errors, email });
        } else {
            res.redirect(`/dashboard?user=${user.email}`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.logoutUser = (req, res) => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
};
