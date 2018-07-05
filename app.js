var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('connected to mongodb');
});
//App init
var app = express();

//Initialize port number
const port = process.env.PORT || 3000;

//View engine setup
//console.log(path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//Set public folder
app.use(express.static(path.join(__dirname, 'public')));
//Set global errors variable
app.locals.errors = null;
//Express fileUpload middleware
app.use(fileUpload());
//Body Parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json());
//Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    //cookie: {secure: true}
}));
//Express validator middleware

app.use(expressValidator({
    errorFormater: function (param, msg, value) {
        var namespace = param.split()
                , root = namespace.shift()
                , formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension)
            {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpeg';
                default:
                    false;
            }
        }
    }
}));
//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
//set routes
//var pages = require('./routes/pages.js');
//var adminpages = require('./routes/admin_pages.js');
//var adminCategories = require('./routes/admin_category.js');
//var adminProducts = require('./routes/admin_products.js');
var leaves = require('./routes/leave.js');


//app.use('/admin/pages', adminpages);
//app.use('/admin/categories', adminCategories);
//app.use('/admin/products', adminProducts);
//app.use('/', pages);
app.use('/user/leaves', leaves);
//start the server
//var port = 3000;
app.listen(port, () => {
    console.log('Server started on port' + port);
});