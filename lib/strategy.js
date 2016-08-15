/**
 * Module dependencies.
 */
var util = require('util')
    , OAuth2Strategy = require('passport-oauth2')
    , InternalOAuthError = require('passport-oauth2').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Fanburst authentication strategy authenticates requests by delegating to
 * Fanburst using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Fanburst application's client id
 *   - `clientSecret`  your Fanburst application's client secret
 *   - `callbackURL`   URL to which Fanburst will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new FanburstStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/fanburst/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://fanburst.com/oauth/authorize';
    options.tokenURL = options.tokenURL || 'https://fanburst.com/oauth/token';

    OAuth2Strategy.call(this, options, verify);
    this.name = 'fanburst';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Fanburst.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `fanburst`
 *   - `id`               the user's Fanburst ID
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
    this._oauth2.get('https://api.fanburst.com/me', accessToken, function (err, body, res) {

        if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

        try {
            var json = JSON.parse(body);

            var profile = {
                provider: 'fanburst',
                id:          json.id,
                displayName: json.id,
                username:    json.name,
                permalink:   json.permalink,
                url:         json.url,
                avatar:      json.avatar_url || '',
                location:    json.location || '',
                followers:   {
                    total: json.followers_count || 0
                },
                followings:  {
                    total: json.followings_count || 0
                },
                tracks: {
                    total: json.track_count || 0
                }
            };

            profile._raw = body;
            profile._json = json;

            done(null, profile);
        } catch(e) {
            done(e);
        }
    });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;