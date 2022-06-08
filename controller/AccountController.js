const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const { DOMAIN_API, DOMAIN_NAME } = process.env;

const AccountController = {
    list: async function(req, res){
        let user = await axios.get(DOMAIN_API + '/listuser');
        console.log(user.data.info);
        let content = [];
        content.push({
            view: 'listAccount',
            data: {users: user.data.info}
        });

        res.render('admin/shopmanager', { content: content });
    },

    dashboard: async function(req, res){
        let info = jwt.decode(req.cookies.token);
        let order = await axios.post(DOMAIN_API + '/orderbyuserid',{
            UserID: info.id
        })



        let category = await axios.get(DOMAIN_API + '/getShowCategory');
        let content = [];
        content.push({
            view: 'pages/dashboard',
            data: {
                order: order.data.info
            }
        });

        let cart = '';
        if (info) {
            let infocart = await axios.post(DOMAIN_API + '/viewcart', {
                uId: info.id
            });
            cart = infocart.data.info.cart;
            products = infocart.data.info.products;
        }

        res.render('index', {
            content: content,
            info: info,
            category: category.data,
            cart: cart,
            products: products,
            url: process.env.DOMAIN_NAME,
            slider: false
        });
    },

    info: async function(req, res){
        let info = jwt.decode(req.cookies.token);
        let order = await axios.post(DOMAIN_API + '/orderbyuserid',{
            UserID: info.id
        })

        let category = await axios.get(DOMAIN_API + '/getShowCategory');

        let user = await axios.post(DOMAIN_API + '/getOneAccount',{
            id: info.id
        })
        console.log(user.data);
        let content = [];
        content.push({
            view: 'pages/infoaccount',
            data: {
                user: user.data.info
            }
        });

        let cart = '';
        if (info) {
            let infocart = await axios.post(DOMAIN_API + '/viewcart', {
                uId: info.id
            });
            cart = infocart.data.info.cart;
            products = infocart.data.info.products;
        }

        res.render('index', {
            content: content,
            info: info,
            category: category.data,
            cart: cart,
            products: products,
            url: process.env.DOMAIN_NAME,
            slider: false
        });
    },

    changepassword: async function(req, res){
        let info = jwt.decode(req.cookies.token);

        let category = await axios.get(DOMAIN_API + '/getShowCategory');
        let content = [];
        content.push({
            view: 'pages/changePassword',
            data: { err: '', urlFrom: req.query.from }
        });
        let cart = [];
        let products = [];

        if (info) {
            let infocart = await axios.post(DOMAIN_API + '/viewcart', {
                uId: info.id
            });
            cart = infocart.data.info.cart;
            products = infocart.data.info.products;
        }
        res.render('index', {
            content: content,
            info: info,
            category: category.data,
            cart: cart,
            products: products,
            url: process.env.DOMAIN_NAME,
            slider: false
        });
    },

    themeChangePassword:  async function(req, res){
        let tokenPassword = await axios.post(DOMAIN_API + '/checktokenpassword',{
            Token: req.params.token,
            Email: req.params.email
        })
        if(tokenPassword.data.status == 'success'){
            let info = jwt.decode(req.cookies.token);

            let category = await axios.get(DOMAIN_API + '/getShowCategory');
            let content = [];
            content.push({
                view: 'pages/doChangePassword',
                data: { params: req.params }
            });
            let cart = [];
            let products = [];
    
            if (info) {
                let infocart = await axios.post(DOMAIN_API + '/viewcart', {
                    uId: info.id
                });
                cart = infocart.data.info.cart;
                products = infocart.data.info.products;
            }
            res.render('index', {
                content: content,
                info: info,
                category: category.data,
                cart: cart,
                products: products,
                url: process.env.DOMAIN_NAME,
                slider: false
            });
        } else {
            res.render('404');
        }
    },

    login: async function (req, res) {
        let info = jwt.decode(req.cookies.token);

        let category = await axios.get(DOMAIN_API + '/getShowCategory');
        let content = [];
        content.push({
            view: 'pages/login',
            data: { err: '', urlFrom: req.query.from }
        });
        let cart = [];
        let products = [];

        if (info) {
            let infocart = await axios.post(DOMAIN_API + '/viewcart', {
                uId: info.id
            });
            cart = infocart.data.info.cart;
            products = infocart.data.info.products;
        }
        res.render('index', {
            content: content,
            info: info,
            category: category.data,
            cart: cart,
            products: products,
            url: process.env.DOMAIN_NAME,
            slider: false
        });
    },

    doLogin: async function (req, res) {
        let urlFrom = req.query.from || '/';

        const login = await axios.post(DOMAIN_API + '/login', {
            username: req.body.username,
            password: req.body.password
        });
        if (login.data.status == 'success') {
            res.cookie('token', login.data.info);
            res.redirect(urlFrom);
        } else {
            let info = jwt.decode(req.cookies.token);

            let category = await axios.get(DOMAIN_API + '/getShowCategory');
            let content = [];
            content.push({
                view: 'pages/login',
                data: { err: login.data.info, urlFrom: urlFrom }
            });
            let cart = [];
            let products = [];

            if (info) {
                let infocart = await axios.post(DOMAIN_API + '/viewcart', {
                    uId: info.id
                });
                cart = infocart.data.info.cart;
                products = infocart.data.info.products;
            }
            res.render('index', {
                content: content,
                info: info,
                category: category.data,
                cart: cart,
                products: products,
                url: process.env.DOMAIN_NAME,
                slider: false
            });
        }
    },

    register: async function (req, res) {
        let info = jwt.decode(req.cookies.token);

        let category = await axios.get(DOMAIN_API + '/getShowCategory');
        let content = [];
        content.push({
            view: 'pages/register',
            data: { err: '' }
        });
        let cart = [];
        let products = [];

        if (info) {
            let infocart = await axios.post(DOMAIN_API + '/viewcart', {
                uId: info.id
            });
            cart = infocart.data.info.cart;
            products = infocart.data.info.products;
        }
        res.render('index', {
            content: content,
            info: info,
            category: category.data,
            cart: cart,
            products: products,
            url: process.env.DOMAIN_NAME,
            slider: false
        });
    },
    
    doRegister: async function (req, res) {
        let urlFrom = req.query.from;
        let register = await axios.post(DOMAIN_API + '/register', {
            UserName: req.body.username,
            Password: req.body.password,
            Name: req.body.name,
            Email: req.body.email,
            Phone: req.body.phone,
            Address: req.body.address
        });
        if (register.data.status == 'success') {
            res.redirect('/account/login');
        } else {
            let info = jwt.decode(req.cookies.token);

            let category = await axios.get(DOMAIN_API + '/getShowCategory');
            let content = [];
            content.push({
                view: 'pages/register',
                data: { err: register.data.info }
            });
            let cart = [];
            let products = [];

            if (info) {
                let infocart = await axios.post(DOMAIN_API + '/viewcart', {
                    uId: info.id
                });
                cart = infocart.data.info.cart;
                products = infocart.data.info.products;
            }
            res.render('index', {
                content: content,
                info: info,
                category: category.data,
                cart: cart,
                products: products,
                url: process.env.DOMAIN_NAME,
                slider: false
            });
        }
    },

    logout: function (req, res) {
        res.clearCookie('token');
        res.redirect(req.query.from);
    }
};

module.exports = AccountController;
