const express = require ('express');
const router = express.Router ();

// mongodb user model
const User = require ('../models/User');

// Password handler
const bcrypt = require ('bcrypt');

//SignUp
router.post ('/signup', (req, res) => {
  let {name, email, password, dateOfBirth} = req.body;
  name = name.trim ();
  email = email.trim ();
  password = password.trim ();
  dateOfBirth = dateOfBirth.trim ();

  if (name == '' || email == '' || password == '' || dateOfBirth == '') {
    res.json ({
      status: 'FAILED',
      message: 'Empty input fields!',
    });
  } else if (!/^[a-zA-Z ]+$/.test (name)) {
    res.json ({
      status: 'FAILED',
      message: 'Invalid name!',
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test (email)) {
    res.json ({
      status: 'FAILED',
      message: 'Invalid email!',
    });
  } else if (password.length < 8) {
    res.json ({
      status: 'FAILED',
      message: 'Password is too short!',
    });
  } else {
    // Checking if the user already exists
    User.find ({email})
      .then (result => {
        if (result.length) {
          // A user already exists
          res.json ({
            status: 'FAILED',
            message: 'User with this email already exists!',
          });
        } else {
          // Try to create a new user
          //password handling
          const saltRounds = 10;
          bcrypt
            .hash (password, saltRounds)
            .then (hashedPassword => {
              const newUser = new User ({
                name,
                email,
                password: hashedPassword,
                dateOfBirth,
              });
              newUser
                .save ()
                .then (result => {
                  res.json ({
                    status: 'SUCCESS',
                    message: 'Signup successful!',
                    data: result,
                  });
                })
                .catch (err => {
                  res.json ({
                    status: 'FAILED',
                    message: 'An error occurred while saving user account password!',
                  });
                });
            })
            .catch (err => {
              res.json ({
                status: 'FAILED',
                message: 'An error occurred while hashing password!',
              });
            });
        }
      })
      .catch (err => {
        console.log (err);
        res.json ({
          status: 'FAILED',
          message: 'An error occurred while checking for existing user!',
        });
      });
  }
});

//SignIn
router.post ('/signin', (req, res) => {
  let {email, password} = req.body;
  email = email.trim ();
  password = password.trim ();

  if (email == '' || password == '') {
    res.json ({
      status: 'FAILED',
      message: 'Empty credentials supplied',
    });
  } else {
    //Checking if the user exists
    User.find ({email})
      .then (data => {
        if (data.length) {
          //User exists
          const hashedPassword = data[0].password;
          bcrypt
            .compare (password, hashedPassword)
            .then (result => {
              if (result) {
                res.json ({
                  status: 'SUCCESS',
                  message: 'Signin successful',
                  data: data,
                });
              } else {
                res.json ({
                  status: 'FAILED',
                  message: 'Invalid password entered',
                });
              }
            })
            .catch (err => {
              res.json ({
                status: 'FAILED',
                message: 'An error occurred while comparing passwords',
              });
            });
        } else {
          res.json ({
            status: 'FAILED',
            message: 'User with this email does not exist',
          });
        }
      })
      .catch (err => {
        res.json ({
          status: 'FAILED',
          message: 'An error occurred while checking for existing user',
        });
      });
  }
});

module.exports = router;
