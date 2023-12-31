const passport = require('passport')
const localStrategy = require('passport-local').Strategy;
const pool = require('../libs/Conection');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const saltRounds = 10;

passport.use('signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    proxy: true,
}, async (req, username, password, done) => {
    console.log(username);
    console.log(passport);
    try {
        const { business_id } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await pool.query('INSERT INTO EstablishmentAdmin (username, password, business_id) VALUES ($1, $2, $3) RETURNING *', [username, hashedPassword, business_id]);
        const user = result.rows[0];

        return done(null, user);
    } catch (e) {
        done(e)
    }
}))

passport.use('login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    proxy: true,
}, async (username, password, done) => {
    try {
        console.log('2');
        console.log(username + ' + ');
        console.log(password);
        const result = await pool.query('SELECT * FROM EstablishmentAdmin WHERE username = $1', [username]);
        const user = result.rows[0];
        if (!user) {
            return done(null, false, { message: 'User not found' })
        }
        console.log(user);
        const validate = await bcrypt.compare(password, user.password);
        console.log(validate);
        if (!validate) {
            return done(null, false, { message: 'Wrong password' })
        }
        console.log('loginMidleware');
        return done(null, user, { message: 'Login successfull' })
    } catch (e) {
        console.log('error');
        return done(e)
    }
}))

passport.use(new JWTStrategy({
    secretOrKey: process.env.JWT_SECRET || 'top_secret',
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter(process.env.JWT_QUERY_PARAM || 'secret_token'),
    proxy: true,
}, async (token, done) => {
    try {
        console.log('jwtStra');
        return done(null, token.user)
    } catch (e) {
        done(error)
    }
}))