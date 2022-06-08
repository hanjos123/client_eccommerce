var express = require('express');
var router = express.Router();

const normalController = require('../controller/NormalController');
const accountController = require('../controller/AccountController');
const cartController = require('../controller/CartController');
const productController = require('../controller/ProductController');
const newsController = require('../controller/NewsController');
const orderController = require('../controller/OrderController');
const pagesController = require('../controller/PagesController');
const opinionController = require('../controller/OpinionController');

const auth = require('../middleware/auth');

var adminRouter = require('../routes/admin');

/* GET home page. */
router.get('/', normalController.home);

router.get('/products/:slug', productController.getDetail);
router.post('/products/find', productController.findProduct);
router.get('/collections', productController.getlistallpro);
router.get(['/sales','/collections/sales','/pages/sales'], productController.getlistprosale);
router.get('/collections/:slug', productController.getlistprobycate);

//ACCOUNT
router.get('/account', auth.checkLoginClient, accountController.dashboard);
router.get('/account/info', auth.checkLoginClient, accountController.info);
router.get('/account/login', accountController.login);
router.post('/account/login', accountController.doLogin);
router.get('/account/register', accountController.register);
router.post('/account/register', accountController.doRegister);
router.get('/account/changepassword', accountController.changepassword);
router.get('/account/logout', auth.checkLoginClient, accountController.logout);
router.get('/account/password-reset/:email/:token', accountController.themeChangePassword);

//CART
router.get('/cart', auth.checkLoginClient, cartController.viewCart);
router.get('/checkout', auth.checkLoginClient, cartController.checkOut);
router.post('/checkout', orderController.completeCheckOut);
router.post('/addtocart', auth.checkLoginClient, cartController.addToCart);
router.post('/deletecart', auth.checkLoginClient, cartController.deleteCart);
router.post(
    '/updatesize',
    auth.checkLoginClient,
    cartController.updateSizeCart
);
router.post(
    '/updatequantity',
    auth.checkLoginClient,
    cartController.updateQuantityCart
);

//NEWS
router.get('/news', newsController.clientList);
router.get('/news/:slug', newsController.detail);

//ORDER
router.get('/order/:id', orderController.orderDetail);
router.get('/order/confirm/:id', orderController.orderConfirmDetail);

router.post('/exportdata', orderController.exportdata);

//PAGES
router.get('/pages/:slug', pagesController.getOne);

router.post('/contact', opinionController.store)

//404 PAGE
// router.get('/*', (req, res)=>{res.render('404');})

module.exports = router;
