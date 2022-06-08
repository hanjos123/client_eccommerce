const axios = require('axios');
const dotenv = require('dotenv');
const { paginator } = require('../helpers/paginator');
dotenv.config();

const { DOMAIN_API } = process.env;

const AdminController = {
        home: async function (req, res) {
        let slider = await axios.get(DOMAIN_API + '/getslide');
        let contact = await axios.get(DOMAIN_API + '/contactnewest');
        let order = await axios.get(DOMAIN_API + '/ordernewest');
        let content = [];
        content.push({ view: 'dashboard', data: { slider: slider.data, contact: contact.data, order: order.data } });
        res.render('admin/shopmanager', { content: content });
    },

    listProducts: async function (req, res) { 
        let page = req.query.page || 1;
        let perPage = req.query.perPage || 10;

        let pagination = await axios.post(DOMAIN_API + '/paginationProduct', {
            page,
            perPage
        });
        
        let pager = paginator('/admin/products/', perPage, pagination.data.totalProduct, page);

        let content = [];
        content.push({
            view: 'listproduct',
            data: { products: pagination.data.products, pager: pager, query: req.query, trash: pagination.data.totalTrashProduct }
        });
        res.render('admin/shopmanager', { content: content });
    },

    listTrashProducts: async function (req, res) { 
        let trashProduct = await axios.get(DOMAIN_API + '/gettrashproduct');
        let content = [];
        content.push({
            view: 'trashProduct',
            data: { products: trashProduct.data }
        });
        res.render('admin/shopmanager', { content: content });
    },

    createProduct: async function (req, res) {
        let allCategories = await axios.get(DOMAIN_API + '/getallcategory');
        let allImage = await axios.get(DOMAIN_API + '/getallimage');
        let content = [];
        content.push({
            view: 'createproduct',
            data: {
                allImage: allImage.data,
                category: allCategories.data.listCategory
            }
        });

        res.render('admin/shopmanager', { content: content });
    },

    doCreateProduct: async function (req, res) {
        console.log(req.body);
        let { pro_name, price, image, editor1, pro_slug } = req.body;
        let product = await axios.post(DOMAIN_API + '/createproduct', {
            pro_name: pro_name,
            price: price,
            pro_slug: pro_slug,
            size: req.body['size[]'],
            quantity: req.body['quantity[]'],
            cate: req.body['cate[]'],
            image: image,
            detail: editor1
        });
        if(product.data.status == 'success'){
            res.redirect('/admin/products');
        }
        res.end();
    },

    editProduct: async function (req, res) {
        
        let id = req.params.id;
        let product = await axios.get(DOMAIN_API + '/getoneproduct/' + id);
        let allCategories = await axios.get(DOMAIN_API + '/getallcategory');
        let allImage = await axios.get(DOMAIN_API + '/getallimage');
        let content = [];
        content.push({
            view: 'editProduct',
            data: {
                allImage: allImage.data,
                product: product.data.info,
                category: allCategories.data.listCategory
            }
        });
        res.render('admin/shopmanager', { content: content });
    },

    doEditProduct: async function (req, res) {
        console.log(req.body);
        let { pro_name, price, priceSale, startSale, endSale, image, editor1 } = req.body;
        let product = await axios.post(DOMAIN_API + '/editproduct', {
            id: req.params.id,
            pro_name: pro_name,
            price: price,
            size: req.body['size[]'],
            quantity: req.body['quantity[]'],
            cate: req.body['cate[]'],
            image: image,
            detail: editor1,
            priceSale: priceSale,
            Sale: {
                start: new Date(startSale),
                end: new Date(endSale)
            }
        });
        if(product.data.status == 'success'){
            res.redirect('/admin/products');
        }
        res.end();
    },

    listCategories: async function (req, res) {
        let allCategories = await axios.get(DOMAIN_API + '/getallcategory');
        let content = [];
        content.push({
            view: 'listcategory',
            data: { category: allCategories.data.listCategory }
        });
        res.render('admin/shopmanager', { content: content });
    },

    createCategory: async function (req, res) {
        let category = await axios.post(DOMAIN_API + '/createcategory', {
            cName: req.body.name,
            cUrl: req.body.slug,
            cParentId: req.body.cate_parent
        });
        let allCategories = await axios.get(DOMAIN_API + '/getallcategory');
        res.render('ajax/tableCategory', {
            category: allCategories.data.listCategory
        });
    },

    createCategoryFromCreateProduct: async function (req, res) {
        let allCategories = await axios.get(DOMAIN_API + '/getallcategory');
        let cateSPId = allCategories.data.listCategory.cateParent0.find(
            x => x.cUrl == 'collections'
        )._id;
        let category = await axios.post(DOMAIN_API + '/createcategory', {
            cName: req.body.name,
            cUrl: req.body.cUrl,
            cParentId: cateSPId
        });
        res.json(category.data);
    },

    createCategoryFromCreateNews: async function (req, res) {
        console.log(req.body.cUrl);
        let allCategories = await axios.get(DOMAIN_API + '/getallcategory');
        let cateSPId = allCategories.data.listCategory.cateParent0.find(
            x => x.cUrl == 'news'
        )._id;
        let category = await axios.post(DOMAIN_API + '/createcategory', {
            cName: req.body.name,
            cUrl: req.body.cUrl,
            cParentId: cateSPId
        });
        res.json(category.data);
    },

    editCategory: async function (req, res) {
        console.log(req.body);
        console.log(req.params.id);
        let category = await axios.post(DOMAIN_API + '/editcategory/' + req.params.id, {
            cName: req.body.title,
            cUrl: req.body.slug,
            cParentId: req.body.parent
        });
        console.log(category.data);
        let allCategories = await axios.get(DOMAIN_API + '/getallcategory');
        res.render('ajax/tableCategory', {
            category: allCategories.data.listCategory
        });
        // res.end();
    },

    changePosition: async function (req, res) {
        let category = await axios.post(DOMAIN_API + '/changeposition', {
            id: req.body.id,
            method: req.body.method
        });
        let allCategories = await axios.get(DOMAIN_API + '/getallcategory');
        res.render('ajax/tableCategory', {
            category: allCategories.data.listCategory
        });
    },

    // changeStatusCategory: async function (req, res) {
    //     console.log(req.body);
    //     let category = await axios.post(DOMAIN_API + '/changestatuscategory', {
    //         id: req.body.id
    //     });
    //     let allCategories = await axios.get(DOMAIN_API + '/getallcategory');
    //     res.render('ajax/tableCategory', {
    //         category: allCategories.data.listCategory
    //     });
    // },

    deleteCategory: async function (req, res) {
        let category = await axios.post(DOMAIN_API + '/deletecategory', {
            id: req.body.id
        });
        let allCategories = await axios.get(DOMAIN_API + '/getallcategory');
        res.render('ajax/tableCategory', {
            category: allCategories.data.listCategory
        });
    },

    login: function (req, res) {
        let content = [];
        res.render('admin/login', { content: content, err: '' });
    },

    doLogin: async function (req, res) {
        const { username, password } = req.body;
        const login = await axios.post(DOMAIN_API + '/loginadmin', {
            username: username,
            password: password
        });
        console.log(login.data);

        if (login.data.status == 'success') {
            res.cookie('tokenAdmin', login.data.info);
            res.redirect('/admin');
        } else {
            res.render('admin/login', {
                err: login.data.info
            });
        }
    },

    logout: function (req, res) {
        res.clearCookie('tokenAdmin');
        res.redirect('/admin/login');
    },

    uploadslider: async function (req, res) {
        console.log(req.files);
        // await axios.post(DOMAIN_API + '/uploadslide', {
        //     image: req.file
        // });
        let slider = await axios.get(DOMAIN_API + '/getslide');
        res.json(slider.data);
    },

    deleteslider: async function (req, res) {
        await axios.post(DOMAIN_API + '/deleteslide', {
            id: req.body.id
        });
        let slider = await axios.get(DOMAIN_API + '/getslide');
        res.json(slider.data);
    }
};

module.exports = AdminController;
