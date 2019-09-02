var express = require('express');
var router = express.Router();
var productService = require('../services/product');
var s3 = require('../services/s3');
var csurf = require('csurf');
var csrfProtection = csurf({ cookie: true });

const cors = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
};

router.get('/', function(req, res, next) {
  res.send('Welcome to ptfnetwork');
});

router.get('/products', cors, function (req, res, next) {
  productService.find({status: 'active'}, function (err, products) {
    if (err) {
      return res.status(400).send(err);
    }

    let maxValue = Math.max.apply(Math, products.map(p => p.price));
    let minValue = Math.min.apply(Math, products.map(p => p.price));

    res.json({ message: "ok", products, min: minValue, max: maxValue })
  });
});

// router.get('/me', auth.checkJWTToken, function (req, res) {
//   res.json({ message: "ok", user: req.user });
// });

// router.post('/form/new', auth.checkJWTToken, s3.upload.single('picture'), function (req, res, next) {

//   let data = JSON.parse(req.body.value);
//   let addedDate = req.body.date;
//   let position = JSON.parse(req.body.position);
//   let pictureThumb = req.file.transforms.filter(f => f.id == 'thumbnail')[0].location;
//   let pictureCover = req.file.transforms.filter(f => f.id == 'cover')[0].location;
//   let picture = req.file.transforms.filter(f => f.id == 'original')[0].location;

//   let name;
//   let evd = {
//     active: false,
//     number: ''
//   };
//   let momo = {
//     active: false,
//     number: ''
//   };
//   let categorie;
//   let exclusivite;
//   let _adder = req.user._id;

//   data.forEach(d => {
//     if (d.key == 'pos-name') {
//       name = d.value;
//     } else if (d.key == 'evd') {
//       evd.active = d.value == 'on';
//     } else if (d.key == 'evd-number') {
//       evd.number = d.value;
//     } else if (d.key == 'marchand-momo') {
//       momo.active = d.value == 'on';
//     } else if (d.key == 'marchand-momo-number') {
//       momo.number = d.value;
//     } else if (d.key == 'category') {
//       categorie = d.value;
//     } else if (d.key == 'exclusivite') {
//       exclusivite = d.value == 'on';
//     }
//   });

//   let informations = data.filter(d => d.id > 8).map(i => {
//     return {
//       orderId: i.id,
//       label: i.label,
//       key: i.key,
//       value: i.value,
//       validation: i.validate
//     };
//   });

//   posService.create(name, position, picture, evd, momo, categorie, exclusivite, 
//     addedDate, _adder, pictureThumb, pictureCover, informations, function (err, pos) {
//     if (err) {
//       return res.status(400).send(err);
//     }
//     if (evd.active) {
//       userService.updateStats(_adder, 'evd', addedDate, function (err, user) {
//         if (err) {
//           return next();
//         }
//         if (momo.active) {
//           userService.updateStats(_adder, 'momo', addedDate, function (err, user) {
//             if (err) {
//               return next();
//             }

//             res.json({ message: "ok", pos })
//           });
//         } else {
//           res.json({ message: "ok", pos })
//         }
//       });
//     }
//     else {
//       res.json({ message: "ok", pos })
//     }
//   });
// });

// router.get('/recrutements', auth.checkJWTToken, function (req, res, next) {
//   recrutementService.find({ _author: req.user.id }, function (err, recrutements) {
//     if (err) {
//       return res.status(400).send(err);
//     }

//     res.json({ message: "ok", recrutements })
//   });
// });

// router.post('/pos/add-recrutement', auth.checkJWTToken, function (req, res, next) {
//   let rec = req.body.rec;
//   let addedDate = req.body.date;

//   recrutementService.create(rec, addedDate, req.user.id, function (err, recrutement) {
//     if (err) {
//       console.log(err);
//       return res.status(400).send(err);
//     }     
    
//     res.json({ message: "ok", recrutement})
//   });
// });

// router.post('/pos/update-recrutement', auth.checkJWTToken, function (req, res, next) {
//   let id = req.body.id;
//   let rec = req.body.rec;

//   recrutementService.update(id, rec, function (err, recrutement) {
//     if (err) {
//       return res.status(400).send(err);
//     }     
    
//     res.json({ message: "ok", recrutement})
//   });
// });

// router.post('/pos/update-rapport', auth.checkJWTToken, function (req, res, next) {
  
//   let posId = req.body.id;
//   let update = req.body.update.filter(u => u.name.trim().length > 0);
//   let position = req.body.position;
//   let addedDate = req.body.date;

//   posService.updateUpdates(posId, update, position, addedDate, 'pending', req.user.id, function (err, pos) {
//     if (err) {
//       console.log(err);
//       return res.status(400).send(err);
//     }     
    
//     res.json({ message: "ok"})
//   });
// });

// router.post('/pos/activation-rapport', auth.checkJWTToken, function (req, res, next) {
  
//   let posId = req.body.id;
//   let tels = req.body.tels.filter(u => u.number.trim().length > 0);
//   let position = req.body.position;
//   let addedDate = req.body.date;
  
  
//   let ps = [];
//   tels.forEach(t => {
//     ps.push(new Promise(function (resolve, reject) {
//       posService.updateActivations(posId, t.number, position, addedDate, 'pending', req.user.id, function (err) {
//         if (err) {
//           console.log(t.number, err);
//           return reject(err);
//         }

//         resolve();
//       });
//     }));
//   });

//   Promise.all(ps).then(function () {
//     return res.json({ message: "ok" })
//   }, reason => {
//     console.log(reason);
//     return res.status(400).send(reason);
//   });
// });

// router.post('/rapports', auth.checkJWTToken, function (req, res, next) {
//   let posId = req.body.id;
//   let data = JSON.parse(req.body.form);
//   let position = req.body.position;
//   let addedDate = req.body.date;

//   let informations = data.map(i => {
//     return {
//       orderId: i.id,
//       label: i.label,
//       key: i.key,
//       value: i.value,
//       validation: i.validate
//     };
//   });

//   posService.findById(posId, function (err, pos) {
//     if (err) {
//       return res.status(400).send(err);
//     }

//     rapportService.create(informations, position, pos._id, addedDate, req.user._id, function (err, rapport) {
//       if (err) {
//         return res.status(400).send(err);
//       }
//       posService.findById(posId, function (err, newpos) {
//         if (err) {
//           return res.status(400).send(err);
//         }
        
//         res.json({ message: "ok", pos: newpos, rapport })
//       });
//     });
//   });
// });

// router.post('/report/:type', auth.checkJWTToken, function (req, res, next) {
//   let content = req.body.content;
//   let addedDate = req.body.date;
//   let type = req.param('type');
  
//   console.log(content, type, addedDate, req.user._id);
//   reportService.create(content, type, addedDate, req.user._id, function (err, report) {
//     if (err) {
//       console.log(err);
//       return res.status(400).send(err);
//     }
//     res.json({ message: "ok", report })
//   });
// });


module.exports = router;