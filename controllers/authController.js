const userModel = require('../models/userModel');

exports.login = (req, res) => {
  const { username, password } = req.body;
  userModel.findUser(username, password, (results) => {
    if (results.length > 0) {
      req.session.user = username;
      res.redirect('/dashboard');
    } else {
      res.send('Usuario o contraseña incorrectos');
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Error al cerrar sesión');
    }
    res.redirect('/');
  });
};

const path = require('path');

exports.dashboard = (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
};
