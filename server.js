const express = require('express');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const nodemailer = require('nodemailer');
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/osteopatia', (req, res) => {
  res.render('osteopatia');
});

app.get('/corsi', (req,res) => {
  res.render('corsi');
});

app.get('/promo', (req,res) => {
  res.render('promo');
});


app.get('/sendmessage', (req,res) => {
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
      
      transporter.sendMail(mailOptions, function(error, info){
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

var port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Listening on port ' + port);
});