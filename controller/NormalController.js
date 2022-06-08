const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const { DOMAIN_API, DOMAIN_SERVER } = process.env;

const NormalController = {
    home: async function (req, res) {
        const newProduct = await axios.get(DOMAIN_API + '/getnewproduct');
        const saleProduct = await axios.get(DOMAIN_API + '/getsaleproduct');
        let category = await axios.get(DOMAIN_API + '/getShowCategory');
        let slider = await axios.get(DOMAIN_API + '/getslide');

        let content = [];
        content.push({
            view: 'products/block',
            data: {
                products: newProduct.data,
                title: 'SẢN PHẨM MỚI NHẤT'
            }
        });

        content.push({
            view: 'products/block',
            data: {
                products: saleProduct.data,
                title: 'SẢN PHẨM GIẢM GIÁ'
            }
        });

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

        res.render('index', {
            content: content,
            info: info,
            category: category.data,
            cart: cart,
            products: products,
            url: process.env.DOMAIN_NAME,
            slider: slider.data
        });
    }
};

module.exports = NormalController;
