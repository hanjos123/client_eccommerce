const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const { DOMAIN_API, DOMAIN_NAME } = process.env;

const CartController = {
    viewCart: async function (req, res) {
        console.log(DOMAIN_NAME);
        let info = jwt.decode(req.cookies.token);
        let category = await axios.get(DOMAIN_API + '/getshowcategory');

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
            view: 'pages/cart',
            data: { cart: cart, products: products }
        });

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

    checkOut: async function (req, res) {
        let info = jwt.decode(req.cookies.token);
        let category = await axios.get(DOMAIN_API + '/getshowcategory');

        let user = await axios.post(DOMAIN_API + '/getOneAccount',{
            id: info.id
        })

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
            view: 'pages/checkout',
            data: { user: user.data.info }
        });

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

    addToCart: async function (req, res) {
        const { slug, size, quantity } = req.body;
        console.log(req.body);

        await axios.post(DOMAIN_API + '/addtocart', {
            uId: jwt.decode(req.cookies.token).id,
            slug: slug,
            size: size,
            quantity: quantity
        });

        let infocart = await axios.post(DOMAIN_API + '/viewcart', {
            uId: jwt.decode(req.cookies.token).id
        });
        console.log(infocart.data);
        res.json(infocart.data.info);
    },

    deleteCart: async function (req, res) {
        await axios.post(DOMAIN_API + '/deletecart', {
            idIndexPro: req.body.id
        });

        let infocart = await axios.post(DOMAIN_API + '/viewcart', {
            uId: jwt.decode(req.cookies.token).id
        });

        res.json(infocart.data.info);
    },

    updateSizeCart: async function (req, res) {
        let { id, size } = req.body;
        await axios.post(DOMAIN_API + '/updatesize', {
            id,
            size
        });
        let infocart = await axios.post(DOMAIN_API + '/viewcart', {
            uId: jwt.decode(req.cookies.token).id
        });
        res.json(infocart.data.info);
    },

    updateQuantityCart: async function (req, res) {
        let { id, method } = req.body;
        await axios.post(DOMAIN_API + '/updatequantity', {
            id,
            method
        });

        let infocart = await axios.post(DOMAIN_API + '/viewcart', {
            uId: jwt.decode(req.cookies.token).id
        });

        console.log(infocart);
        res.json(infocart.data.info);
    }
};

module.exports = CartController;
