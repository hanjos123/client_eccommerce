var express = require('express');
const orderController = require('../controller/OrderController');
var router = express.Router();
const adminController = require('../controller/AdminController');
const newsController = require('../controller/NewsController');
const productController = require('../controller/ProductController');
const pagesController = require('../controller/PagesController');
const opinionController = require('../controller/OpinionController');
const accountController = require('../controller/AccountController');


const auth = require('../middleware/auth');

router.get('/', auth.checkLoginAdmin, adminController.home);

router.get('/products', auth.checkLoginAdmin, adminController.listProducts);
router.get('/products/trash', auth.checkLoginAdmin, adminController.listTrashProducts);
router.get('/products/create', auth.checkLoginAdmin,adminController.createProduct);
router.post('/products/create', auth.checkLoginAdmin,adminController.doCreateProduct);
router.get('/products/edit/:id', auth.checkLoginAdmin, adminController.editProduct);
router.post('/products/edit/:id', auth.checkLoginAdmin, adminController.doEditProduct );

router.get('/products/delete/:id', auth.checkLoginAdmin, productController.delete)
router.get('/products/duplicate/:id', auth.checkLoginAdmin, productController.duplicate)


router.post(
    '/category/edit/:id',
    auth.checkLoginAdmin,
    adminController.editCategory
);

router.post(
    '/category/create',
    auth.checkLoginAdmin,
    adminController.createCategory
);

router.post(
    '/category/createfromproduct',
    auth.checkLoginAdmin,
    adminController.createCategoryFromCreateProduct
);

router.post(
    '/category/createfromnews',
    auth.checkLoginAdmin,
    adminController.createCategoryFromCreateNews
);

router.post(
    '/category/changeposition',
    auth.checkLoginAdmin,
    adminController.changePosition
);

router.post(
    '/category/delete',
    auth.checkLoginAdmin,
    adminController.deleteCategory
);
router.get('/category', auth.checkLoginAdmin, adminController.listCategories);

router.get('/login', adminController.login);
router.post('/login', adminController.doLogin);
router.get('/logout', adminController.logout);

router.post(
    '/uploadslider',
    auth.checkLoginAdmin,
    adminController.uploadslider
);
router.post(
    '/deleteslider',
    auth.checkLoginAdmin,
    adminController.deleteslider
);

//NEWS
router.get('/news', auth.checkLoginAdmin, newsController.adminList);
router.get('/news/create', auth.checkLoginAdmin, newsController.createNews);
// router.post('/news/create', auth.checkLoginAdmin, newsController.doCreateNews);
router.get('/news/edit/:id', auth.checkLoginAdmin, newsController.editNews);
router.post('/news/edit/:id', auth.checkLoginAdmin, newsController.doEditNews);

//ORDER
router.get('/order', auth.checkLoginAdmin, orderController.orderList);
router.get('/order/edit/:id', auth.checkLoginAdmin, orderController.editOrder);
router.get('/order/print/:id', auth.checkLoginAdmin, orderController.print);

//PAGES
router.get('/pages', auth.checkLoginAdmin, pagesController.list)
router.get('/pages/edit/:id', auth.checkLoginAdmin, pagesController.edit)
router.get('/pages/create', auth.checkLoginAdmin, pagesController.createPages);


//CONTACT
router.get('/contact', auth.checkLoginAdmin, opinionController.list);

//ACCOUNT
router.get('/account', auth.checkLoginAdmin, accountController.list)

module.exports = router;
