# Passport-Fanburst

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Fanburst](https://fanburst.com) using the OAuth 2.0 API.

This module lets you authenticate using Fanburst in your Node.js applications.

## Install

    $ npm install passport-fanburst

## Usage

#### Configure Strategy

The Fanburst authentication strategy authenticates users using a Fanburst
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new FanburstStrategy({
        clientID: FANBURST_CLIENT_ID,
        clientSecret: FANBURST_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/fanburst/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ fanburstId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));
    
<b>NOTE: don't supports refresh tokens for now</b>

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'fanburst'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/fanburst',
      passport.authenticate('fanburst'));

    app.get('/auth/fanburst/callback', 
      passport.authenticate('fanburst', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });
