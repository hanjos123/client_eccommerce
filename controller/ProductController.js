const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const { DOMAIN_API } = process.env;

const ProductController = {
    getDetail: async function (req, res) {
        let category = await axios.get(
            process.env.DOMAIN_API + '/getshowcategory'
        );

        let slug = req.params.slug;
        let product = await axios.post(DOMAIN_API + '/getoneproductbyslug', {
            slug
        });

        let productSuggest = await axios.get(DOMAIN_API + '/getsuggestproduct/'+ slug);

        let info = jwt.decode(req.cookies.token);
        let cart = [];
        let products = [];

        if (info) {
            let infocart = await axios.post(DOMAIN_API + '/viewcart', {
                uId: info.id
            });
            cart = infocart.data.info.cart;
            products = infocart.data.info.products;
        }

        let content = [];
        content.push({
            view: 'products/detail',
            data: {
                product: product.data.info,
                proSuggest: productSuggest.data
            }
        });

        res.render('index', {
            content: content,
            info: jwt.decode(req.cookies.token),
            cart: cart,
            category: category.data,
            products: products,
            url: '/products/' + slug,
            slider: false
        });
    },

    findProduct: async function (req, res) {
        let category = await axios.get(
            process.env.DOMAIN_API + '/getshowcategory'
        );

        let str = req.body.str;
        let product = await axios.post(DOMAIN_API + '/findproduct', {
            str
        });

        console.log(product.data);

        let content = [];
        let products = [];
        let cart = [];
        let info = jwt.decode(req.cookies.token);
        if (info) {
            let infocart = await axios.post(DOMAIN_API + '/viewcart', {
                uId: info.id
            });
            cart = infocart.data.info.cart;
         
            products = infocart.data.info.products;
        }
        content.push({
            view: 'products/search',
            data: { product: product.data.info, str: str }
        });

        res.render('index', {
            content: content,
            info: jwt.decode(req.cookies.token),
            cart: cart,
            category: category.data,
            products: products,
            url: '/',
            slider: false
        });
    },

    getlistallpro: async function (req, res) {
        let category = await axios.get(
            process.env.DOMAIN_API + '/getShowCategory'
        );

        let product = await axios.post(DOMAIN_API + '/getallproductbyslug', {
            page: 1,
            perPage: 9
        });


        let products = [];
        let cart = [];
        let info = jwt.decode(req.cookies.token);
        if (info) {
            let infocart = await axios.post(DOMAIN_API + '/viewcart', {
                uId: info.id
            });
            cart = infocart.data.info.cart;
         
            products = infocart.data.info.products;
        }
        let content = [];
        content.push({
            view: 'products/listcategory',
            data: { 
                    products: product.data.info,
                    slug: ''
                }
        });
        console.log(content[0].data);
        res.render('index', {
            slug: 'fdfdfff',
            content: content,
            info: jwt.decode(req.cookies.token),
            cart: cart,
            category: category.data,
            products: products,
            url: '/',
            slider: false
        });
    },

    getlistprosale: async function (req, res) {
        let category = await axios.get(DOMAIN_API + '/getShowCategory');

        let product = await axios.post(DOMAIN_API + '/getallproductsale', {
            page: 1,
            perPage: 9
        });

        let products = [];
        let cart = [];
        let info = jwt.decode(req.cookies.token);
        if (info) {
            let infocart = await axios.post(DOMAIN_API + '/viewcart', {
                uId: info.id
            });
            cart = infocart.data.info.cart;
         
            products = infocart.data.info.products;
        }
        let content = [];
        content.push({
            view: 'products/listcategory',
            data: { products: product.data , slug: ''}
        });

        res.render('index', {
            content: content,
            info: jwt.decode(req.cookies.token),
            cart: cart,
            category: category.data,
            products: products,
            url: '/',
            slider: false
        });
    },

    getlistprobycate: async function (req, res) {
        let category = await axios.get(DOMAIN_API + '/getShowCategory');

        let product = await axios.post(DOMAIN_API + '/getallproductbyslug',{
            slug: req.params.slug
        });

        let products = [];
        let cart = [];
        let info = jwt.decode(req.cookies.token);
        if (info) {
            let infocart = await axios.post(DOMAIN_API + '/viewcart', {
                uId: info.id
            });
            cart = infocart.data.info.cart;
         
            products = infocart.data.info.products;
        }
        let content = [];
        content.push({
            view: 'products/listcategory',
            data: { products: product.data.info , slug: req.params.slug || ''}
        });

        res.render('index', {
            content: content,
            info: jwt.decode(req.cookies.token),
            cart: cart,
            category: category.data,
            products: products,
            url: '/',
            slider: false
        }); 
    },

    delete: async function(req, res){
        let { id } = req.params;
        let product = await axios.get(DOMAIN_API + '/deleteproduct/' + id);
        res.redirect('/admin/products/trash');
        
    },

    duplicate: async function(req, res){
        let id = req.params.id;
        let product = await axios.get(DOMAIN_API + '/duplicate/' + id);
        res.redirect('/admin/products/edit/'+product.data._id);
    }
};

module.exports = ProductController;
