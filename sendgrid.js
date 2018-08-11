/**
 * Import Node Modules and setup express router
 */
var express = require("express"),
  router = express.Router(),
  router = express.Router({
    mergeParams: true
  }),
  User = require("../models/user"),
  middleware = require("../middleware/"),
  nodemailer = require("nodemailer"),
  crypto = require("crypto"),
  async = require("async"),
  mg = require('nodemailer-mailgun-transport');
/**
 * Mailgun Auth
 */
var mgAuth = {
  auth: {
    api_key: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN
  },
}
var nodemailerMailgun = nodemailer.createTransport(mg(mmgAuth));
/**
 * Forgot Route Route
 */
router.get('/', function (req, res) {
  if (req.user) {
    res.redirect("/")
  } else {
    res.render("forgot/index", {
      title: "Forgot Password"
    })
  }
});
router.post('/', function (req, res) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(16, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token)
      });
    },
    function (token, done) {
      User.findOne({
        email: req.body.forgot.email
      }, function (err, user) {
        if (!user) {
          return res.redirect('/forgot');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var forgotPasswordEmail = {
        to: user.email,
        from: `noreply@${process.env.MAILGUN_DOMAIN}`,
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/forget/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      nodemailerMailgun.sendMail(forgotPasswordEmail, function (err) {
        console.log("Sent email token");
        res.redirect("/")
        done(err, 'done');
      })
    },
  ])
});
router.get("/reset/:token", function (req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (!user) {
      return res.redirect('/forgot');
    }
    res.render('forgot/reset', {
      title: "Reset Password",
      token: req.params.token
    });
  });
});

router.post("/reset/:token", function (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!user) {
          return res.redirect('/auth/login');
        }
        if (req.body.password.password === req.body.password.passwordConfirm) {
          user.setPassword(req.body.password.password, function (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
              req.logIn(user, function (err) {
                done(err, user);
              });
            });
          })
        } else {
          return res.redirect('/');
        }
      });
    },
    function (user, done) {
      var forgotResetPasswordEmail = {
        to: user.email,
        from: `noreply@${process.env.MAILGUN_DOMAIN}`,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      nodemailerMailgun.sendMail(forgotResetPasswordEmail, function (err) {
        console.log("Sent email confirmation");
        done(err, 'done');
      })
    }
  ], function (err) {
    res.redirect('/');
  });
});


module.exports = router;