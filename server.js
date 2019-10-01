const express = require('express');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const nodemailer = require('nodemailer');
const utilsUser = require('./utilsUser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');

// switch between pages ejs engine //////////////////////////
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/osteopatia', (req, res) => {
  res.render('osteopatia');
});

app.get('/corsi', (req, res) => {
  res.render('corsi');
});

app.get('/promo', (req, res) => {
  res.render('promo');
});

app.get('/login-page', (req, res) => {
  res.render('login-page');
});

app.get('/register-page', (req, res) => {
  res.render('register-page');
})

/////////////////////////////////////////////////////////////

app.get('/sendmessage', (req, res) => {
  let name = req.query.name;
  let mail = req.query.email;
  let phone = req.query.phone;
  let message = req.query.message;

  console.log(name);
  console.log(mail);
  console.log(phone);
  console.log(message);

  let ourMail = '...';
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ourMail,
      pass: '...'
    }
  });

  var mailOptions = {
    from: mail,
    to: ourMail,
    subject: 'Richiesta di informazioni',
    text: name + ' - ' + 'tel: ' + phone + ' ------ ' + message
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.render('sendmail', {
        msg: 'C è stato un errore, riprova'
      });
    } else {
      console.log('Email sent: ' + info.response);
      res.render('sendmail', {
        msg: 'Mail inviata correttamente'
      });
    }
  });
});

app.post('/registerUser', async (req, res) => {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let username = req.body.username;
  let cel = req.body.cel;
  let password = req.body.password;
  let passwordrepeated = req.body.passwordrepeated;

  if (firstname == '' ||
    lastname == '' ||
    username == '' ||
    cel == '' ||
    password == '' ||
    passwordrepeated == '') {
    res.render('register-page', {
      msg: 'Hai dimenticato di inserire qualcosa! Riprova!'
    });
  }
  else if (password != passwordrepeated) {
    res.render('register-page', {
      msg: 'Le password che hai inserito non sono uguali! Riprova!'
    });
  } else {
    // insert user in db 
    try {
      const resEnterUser = await utilsUser.insertUser(firstname, lastname, username, cel, password);
      console.log(resEnterUser);
      if (resEnterUser == 1)
        res.status(200).send('Utente aggiunto correttamente');
      else if (resEnterUser == 2) {
        res.render('register-page', {
          msg: 'Username già esistente, cambia e riprova!'
        });
      }
    } catch (error) {
      res.render('register-page', {
        msg: error
      });
    }
  }
});

app.post('/loginUser', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  try {
    const enter = await utilsUser.recoverUser(username, password);
    if (enter == 1){
      res.status(200).send('Ciao ' + username);
    } else if (enter == 2){
      res.render('login-page', {
        msg: 'password incorretta, riprova'
      });
    }
    
  } catch (error) {
    res.render('login-page', {
      msg: error
    });
  }
});


var port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});