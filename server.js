const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const ProductsSchema = require('./schemas/Products');
const ClientsSchema = require('./schemas/Clients');
const md5 = require('md5');

const MONGODB_URL = 'mongodb://@localhost:27017/store';

let env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

require('useful-nunjucks-filters')(env);

const Products = mongoose.model('Product', ProductsSchema);
const Clients = mongoose.model('Clients', ClientsSchema);

mongoose.connect(MONGODB_URL, {useNewUrlParser: true}, err => {
    if (err) {
        console.error('[SERVER_ERROR] MongoDB Connection:', err);
        process.exit(1);
    }
    console.info('Mongo connected');


    app.listen(3000, () => {
      console.log('Escutando na porta 3000');
    });

});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.use(express.static('public'));
app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/products', (req, res) => {
  Products.find((err, obj) => {
      res.render('products.html', {products: obj});
  });
});


app.delete('/admin/product/:id', (req, res) => {
  Products.findOneAndRemove({_id: req.params.id}, (err, obj) => {
    if(err) {
      res.send('error');
    }
    res.send('ok');
  });
});

app.get('/admin/list-products', (req, res) => {
  Products.find((err, obj) => {
    obj = obj.sort((a,b) => {
      if (a.name > b.name) {
       return 1;
      }
      if (b.name > a.name) {
           return -1;
      }
      return 0;
    });
      res.render('admin/list-products.html', {products: obj});
  });
});
app.get('/admin/products', (req, res) => {
  res.render('admin/products.html');
});

app.get('/contact', (req, res) => {
  res.render('contact.html');
});

app.get('/register', (req, res) => {
  res.render('register.html');
});

app.get('/cart', (req, res) => {
  res.render('cart.html');
});

app.get('/artur', function (req, res) {
  res.render('artur.html');
});

app.post('/send', (req, res) => {
  var email = 'artur.nzk@gmail.com';
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'senacerechim2019@gmail.com',
      pass: 'senacrserechim'
    }
  });
  const mailOptions = {
    from: 'senacerechim2019@gmail.com',
    to: email,
    subject: 'Hello ' + req.body.name + ' sending e-mail using Node.js',
    text: req.body.message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    res.send('ok');
  });
});

app.post('/client', (req, res) => {
  var client = new Clients(req.body);
  client.password = md5(client.password);
  client.save((err, client) => {
    console.info(client.name + ' salvo');
    res.send('ok');
  })
});

app.post('/admin/products', (req, res) => {
  var newProduct = new Products(req.body);
  newProduct.save((err, newProduct) => {
    console.info(newProduct.name + ' salvo');
    res.send('ok');
  })
});
app.post('/login', (req, res) => {
  Clients.find({'email': req.body.email, 'password': md5(req.body.password)}, (err, obj) => {
    if (err || obj.length === 0) {
      res.send('error');
    } else {
      res.send('ok');
    }
  })
})

app.get('/product/:id', (req, res) => {
  Products.find({"_id": req.params.id }, (err, obj) => {
      if (err) {
        res.render('notfound.html');
      } else {
        const product = obj[0];
        res.render('product.html', {product: product});
      }
  });
});

// APIs
app.get('/api/products', (req, res) => {
  res.send(listProducts);
});

app.get('/api/product/:id', (req, res) => {
  Products.find({"_id": req.params.id }, (err, obj) => {
      if (err) {
        res.send(null);
      } else {
        const product = obj[0];
        res.send(product);
      }
  });
});
