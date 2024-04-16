// habitController.js

const User = require('../models/User.js');
const Habit = require('../models/Habit.js');
var email="";
exports.getWelcome = async(req,res)=>{
    // console.log("request",req.user, req.email)
    res.render('welcome');
}
exports.getDashboard = async (req, res) => {
    // Logic to retrieve user's dashboard data
    try {
        email = req.query.user;
        const user = await User.findOne({ email });
        const habits = await Habit.find({ email });
        
        // console.log("request",req.user, req.email, req.query.user, user, habits)
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(getDate(i));
        }

        res.render('dashboard', { habits, user, days });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

function getDate(n) {
    let d = new Date();
    d.setDate(d.getDate() + n);
    const newDate = d.toLocaleDateString('pt-br').split('/').reverse().join('-');
    let day;
    switch (d.getDay()) {
        case 0: day = 'Sun'; break;
        case 1: day = 'Mon'; break;
        case 2: day = 'Tue'; break;
        case 3: day = 'Wed'; break;
        case 4: day = 'Thu'; break;
        case 5: day = 'Fri'; break;
        case 6: day = 'Sat'; break;
    }
    return { date: newDate, day };
}

exports.changeView = async (req, res) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(404).send("User not found");
        }

        user.view = user.view === 'daily' ? 'weekly' : 'daily';
        await user.save();
        return res.redirect('back');
    } catch (err) {
        console.log("Error changing view:", err);
        return res.status(500).send("Error changing view");
    }
};


exports.addHabit = async (req, res) => {
    try {
        // Access user information from req.user
       


        // Access habit content from req.body
        const { content } = req.body;

        // Check if the email is provided
        if (!email) {
            console.error("User email is missing");
            return res.status(400).send("User email is missing");
        }

        // Create a new Habit with the provided email and content
        const habit = new Habit({
            email: email,
            content: content,
            // Assuming dates will be automatically generated based on the current date
        });

        // Save the new habit to the database
        await habit.save();

        // console.log("New habit created:", habit);
        res.redirect('back');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};


exports.toggleFavorite = async (req, res) => {
    try {
        const id = req.query.id;
        // console.log(req.query);
        const habit = await Habit.findOne({ _id: id});

        if (!habit) {
            console.log("Habit not found");
            req.flash('error_msg', 'Habit not found');
            return res.redirect('back');
        }

        habit.favorite = !habit.favorite;
        await habit.save();

        const message = habit.favorite ? 'Habit added to Favorites!' : 'Habit removed from Favorites!';
        req.flash('success_msg', message);
        return res.redirect('back');
    } catch (err) {
        console.log("Error toggling favorite status:", err);
        req.flash('error_msg', 'Error toggling favorite status');
        return res.redirect('back');
    }
};



exports.updateHabitStatus = async (req, res) => {
    try {
        const date = req.query.date;
        const id = req.query.id;

        const habit = await Habit.findById(id);
        if (!habit) {
            console.log("Habit not found");
            return res.status(404).send("Habit not found");
        }

        let dates = habit.dates;
        let found = false;

        dates.forEach(item => {
            if (item.date === date) {
                if (item.complete === 'yes') {
                    item.complete = 'no';
                } else if (item.complete === 'no') {
                    item.complete = 'none';
                } else if (item.complete === 'none') {
                    item.complete = 'yes';
                }
                found = true;
            }
        });

        if (!found) {
            dates.push({ date: date, complete: 'yes' });
        }

        habit.dates = dates;
        await habit.save();
        
        // console.log("Habit updated:", habit);
        return res.redirect('back');
    } catch (err) {
        console.log("Error updating habit status:", err);
        return res.status(500).send("Error updating habit status");
    }
};


exports.removeHabit = async (req, res) => {
    try {
        const id = req.query.id;
        // const email = req.user.email; // Assuming req.user contains the user's email

        const result = await Habit.deleteMany({ _id: id });
        if (result.deletedCount === 0) {
            console.log("No record(s) found to delete");
            req.flash('error_msg', 'No record(s) found to delete');
        } else {
            console.log("Record(s) deleted successfully");
            req.flash('success_msg', 'Record(s) deleted successfully');
        }

        return res.redirect('back');
    } catch (err) {
        console.log("Error deleting record(s):", err);
        req.flash('error_msg', 'Error deleting record(s)');
        return res.redirect('back');
    }
};

