const express = require('express')
const router = express.Router();
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

findById = function (id, cb) {
    process.nextTick(async function () {
        try {
            const users = await User.findById(id).select('-__V')
            //const idx = records.findIndex(e => e.id === id)

            // const idx = id - 1
            // if (records[idx]) {
            //     cb(null, records[idx])
            // } else {
            //     cb(new Error('User ' + id + ' does not exist'))
            // }
            if (users) {
                cb(null, users)
            } else {
                cb(new Error('User ' + id + ' does not exist'))
            }
        } catch (e) {

        }
    })
}

findByUsername = function (username, cb) {
    process.nextTick(async function () {
        try {
            const user = await User.findOne({username}).select('-__V')
            if (user.username === username) {
                return cb(null, user)
            }
            return cb(null, null)
        } catch (e) {
            console.log(e)
        }
    })
}
verifyPassword = (user, password) => {
    return user.password === password
}

const verify = (username, password, done) => {
    findByUsername(username, (err, user) => {
        if (err) {
            return done(err)
        }
        if (!user) {
            return done(null, false)
        }

        if (!verifyPassword(user, password)) {
            return done(null, false)
        }
        return done(null, user)
    })
}

const options = {
    usernameField: "username",
    passwordField: "password",
}

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
    findById(id, (err, user) => {
        if (err) {
            return cb(err)
        }
        cb(null, user)
    })
})

router.use(session({secret: 'SECRET'}));

router.use(passport.initialize())
router.use(passport.session())


router.get('/', (req, res) => {
    res.render('home', {user: req.user})
})

router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/signup', (req, res) => {
    res.render('register')
})

router.post('/signup', async (req, res) => {
    const {username, password, displayName, emails} = req.body
    const newUser = new User({username, password, displayName, emails})
    try {
        await newUser.save()
        // records.push({
        //     id: uuid(),
        //     username: req.body.username,
        //     password: req.body.password,
        //     displayName: req.body.displayName,
        //     emails: req.body.emails
        // })
        res.redirect('/api/user/me')
    } catch (e) {
        res.redirect('/404');
    }
})

router.post('/login',
    passport.authenticate('local', {failureRedirect: '/api/user/login'}),
    (req, res) => {
        res.redirect('/api/user/me')
    })

router.get('/logout', function (req, res, next) {
    req.logout()
    res.redirect('/api/user/login');
});
router.get('/me',
    (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/api/user/login')
        }
        next()
    },
    (req, res) => {
        res.render('profile', {user: req.user})
    }
)

module.exports = router