/**
 * Module dependencies
 * Developer : @Sumit Jaiswal
 * Date 19-Jan-2016
 */

var     cors = require('cors'),
        express = require('express'),
        multer = require('multer'),
        routes = require('./routes'),
        http = require('http'),
        path = require('path');

///////////////////////////==========FOR WEBSERVICES===========////////////////////////////////
var api = require('./routes/api'),
        users = require('./routes/users'),
        products = require('./routes/products'),
        category = require('./routes/category'),
        brand = require('./routes/brand'),
        uploads = require('./routes/upload'),
        orders = require('./routes/orders');


var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bson = require('bson');
var app = module.exports = express();
app.use(cors());
var md5 = require('MD5');

//create database object
var db = require('mongoskin').db('mongodb://localhost:27017/e_shop');

// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    next();
});
// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
// development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
    // TODO
}
/**
 * Routes
 */

// serve index
app.get('/', routes.index);
app.get('/*/:*', routes.index);
app.post('/*/:*', routes.index);

// JSON API
app.get('/api/name', api.name);

//================================FOR API====================================//
//For users 
app.post('/api/users', users.add_user);
app.get('/api/users', users.all_user);
app.put('/api/users', users.update_user);
app.delete('/api/users', users.delete_user);
app.get('/api/users/:id', users.view_user);
app.post('/api/login', users.login_user);
app.get('/api/userView/:id', api.view_user);
app.post('/api/userUpdate', api.update_user);
app.post('/api/userDelete', api.delete_user);
 

//for products
app.post('/api/addProduct', products.add_product);
app.post('/api/updateProduct', products.update_product);
app.get('/api/allProducts', products.all_product);
app.post('/api/produtDelete', products.delete_product);
app.get('/api/productView/:id', products.view_product);

//fornt app
app.get('/api/products', products.all_product);
// app.get('/api/productstype', products.type_for)
app.get('/api/product/:id', products.view_product);

//order
app.post('/api/placeOrder', orders.place_order);
app.get('/api/getOrder/:id', orders.get_order);

//get product by category ID
app.get('/api/productByCategory/:id', products.getProductByCategory);

//For Upload file 
var products_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/products')
    },
    filename: function (req, file, cb) {
        console.log(file.mimetype);
        var fileExt = file.mimetype;
        var data = fileExt.split('/');
        cb(null, Date.now() + '.' + data[1]) //Appending .jpg
    }
})
var upload = multer({storage: products_storage})

// accept one file where the name of the form field is named photho
app.post('/uploadSingleFile', upload.single('image'), uploads.uploadSingleFile);

// accept multi file where the name of the form field is named photho
app.post('/uploadMultipleFile', upload.array('images'), uploads.uploadMultipleFile);

//for category
app.post('/api/category/add', category.add_category);
app.get('/api/category/all', category.all_category);
app.get('/api/allcategory', category.all_category);
app.post('/api/category/delete', category.delete_category);
app.post('/api/category/update', category.update_category);
app.get('/api/CategoryView/:id', category.view_category);
app.get('/api/childCategory/:id', category.child_category);

//for brand
app.post('/api/brand/add', brand.add_brand);
app.get('/api/brand/all', brand.all_brand);
app.post('/api/brand/delete', brand.delete_brand);
app.post('/api/brand/update', brand.update_brand);
app.get('/api/BrandView/:id', brand.view_brand);
app.get('/api/allbrands', brand.get_brands);



app.get('*', routes.index);
/**
 * Start Server
 */


//app.set('domain', 'nodejssample.js');
//app.set('port', process.env.PORT || 8080);



http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port http://localhost:' + app.get('port'));
});
