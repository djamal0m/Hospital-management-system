var request = require('request');
var express = require('express');
var router = express.Router();
var auth = require('../auth');
var adminService = require('../services/admin');
var doctorService = require('../services/doctor');
var csurf = require('csurf');
var uuid = require('uuid');
var csrfProtection = csurf({ cookie: true });

const isLogged = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login'); // localhost
  }
  return next();
};

router.get('/', isLogged, function(req, res, next) {
  res.render('index', {});
});

// Admin user

router.get('/login', csrfProtection, function(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  res.render('login', {
    messages: req.flash('messages'),
    errors: req.flash('error'),
    csrfToken: req.csrfToken()
  });
});

router.get('/settings', isLogged, csrfProtection, function (req, res, next) {
  res.render('settings', {
    messages: req.flash('messages'),
    errors: req.flash('errors'),
    csrfToken: req.csrfToken()
  });
});

router.post('/login', csrfProtection, auth.postLogin);

router.get('/register', csrfProtection, function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  res.render('register', {
    messages: req.flash('messages'),
    errors: req.flash('errors'),
    csrfToken: req.csrfToken()
  });
});

router.post('/register', csrfProtection, function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  adminService.findOne({ email: email }, function (err, admin) {
    if (err) {
      return next(err);
    }

    if (admin) {
      req.flash('errors', 'L\'email est déjà utilisé');
      return res.redirect('back');
    }

    adminService.register(email, password, 'superadmin', function (err, user) {
      if (err) {
        return next(err);
      }

      req.flash('messages', 'Votre compte a été correctement créé. Veuillez vous connecter.');
      res.redirect('/login');
    });
  });
});

router.post('/update-profile', isLogged, csrfProtection, function (req, res, next) {
  adminService.update(req.user.id, req.body, function (err) {
    if (err) {
      return next(err);
    }

    req.flash('messages', 'Vos informations ont été correctement mises à jour.');    
    res.redirect('back');
  });
});

router.post('/logout', auth.logout);

router.get('/admins', isLogged, csrfProtection, function (req, res, next) {
  adminService.find({}, function (err, admins) {
    if (err) {
      return next(err);
    }

    res.render('admins/list', {
      admins,
      messages: req.flash('messages'),
      errors: req.flash('errors'),
      csrfToken: req.csrfToken()
    });
  });
});

router.post('/admins', csrfProtection, function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var role = req.body.role;

  adminService.findOne({ email: email }, function (err, admin) {
    if (err) {
      return next(err);
    }

    if (admin) {
      req.flash('errors', 'L\'email est déjà utilisé');
      return res.redirect('back');
    }

    adminService.register(email, password, role, function (err, user) {
      if (err) {
        return next(err);
      }

      req.flash('messages', 'Le compte a été correctement créé.');
      res.redirect('/admins');
    });
  });
});

router.post('/admin/delete', csrfProtection, function (req, res, next) {
  var id = req.body.id;

  adminService.remove(id, function (err) {
    if (err) {
      return next();
    }

    req.flash('messages', 'L\'admin a été bien supprimé.');
    res.redirect('/admins');
  });
});

// Doctors
router.get('/doctors', isLogged, csrfProtection, function (req, res, next) {
  doctorService.find({}, function (err, doctors) {
    if (err) {
      return next(err);
    }

    res.render('doctors/list', {
      doctors,
      messages: req.flash('messages'),
      errors: req.flash('errors'),
      csrfToken: req.csrfToken()
    });
  });
});

router.get('/doctor/add', isLogged, csrfProtection, function (req, res, next) {
  res.render('doctors/add', {
    messages: req.flash('messages'),
    errors: req.flash('errors'),
    csrfToken: req.csrfToken()
  });
});

router.get('/doctor/:id/update', isLogged, csrfProtection, function (req, res, next) {
  doctorService.findById(req.param('id'), function (err, doctor) {
    if (err) {
      return next(err);
    }

    res.render('doctors/edit', {
      doctor,
      messages: req.flash('messages'),
      errors: req.flash('errors'),
      csrfToken: req.csrfToken()
    });
  });
});

router.post('/doctor/add', isLogged,csrfProtection, function (req, res, next) {
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var doctor_id = req.body.doctor_id;
  var address = req.body.address;
  var phone = req.body.phone;
  var specialty = req.body.specialty;

  doctorService.create(first_name, last_name, doctor_id, address, phone, specialty, function (err) {
    if (err) {
      return next(err);
    }

    req.flash('messages', 'La catégorie a été correctement ajoutée.');
    res.redirect('/doctors');
  });
});

router.post('/doctor/:id/update', isLogged, csrfProtection, function (req, res, next) {
  doctorService.update(req.param('id'), req.body, function (err) {
    if (err) {
      return next(err);
    }

    req.flash('messages', 'La catégorie a été correctement mise à jour.');
    res.redirect('/doctors');
  });
});

router.post('/doctor/delete', isLogged, csrfProtection, function (req, res, next) {
  var id = req.body.id;

  doctorService.remove(id, function (err) {
    if (err) {
      return next();
    }

    req.flash('messages', 'La doctor a été bien supprimée.');
    res.redirect('/doctors');
  });
});

module.exports = router;