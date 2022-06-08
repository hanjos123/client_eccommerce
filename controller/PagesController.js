const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const { DOMAIN_API } = process.env;

const PagesController = {   
    list: async function(req, res){
        let listPages = await axios.get(DOMAIN_API + '/getallpages/?page=' + (req.query.page || 1) + '&perPage=' + (req.query.perPage || 10));
        
        let content = [];
        content.push({
            view: 'listPages',
            data: {pages: listPages.data}
        });

        res.render('admin/shopmanager', { content: content });
    },
    
    edit: async function (req, res){
        let id = req.params.id;
        let page = await axios.get(DOMAIN_API + '/getonepageId/' + id);
        let content = [];
        content.push({
            view: 'editPages',
            data: {pages: page.data.info}
        });

        res.render('admin/shopmanager', { content: content });
    },

    getOne: async function(req, res){
        let category = await axios.get(DOMAIN_API + '/getShowCategory');

        let pages = await axios.get(DOMAIN_API + '/getonepage/' + req.params.slug);
        console.log(pages.data);

        // if(pages.status == 'success'){
            let content = [];
            content.push({
                view: 'pages/pages',
                data: {
                    pages: pages.data.info
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
                slider: false
            });
        // } else {
        //     res.render('404');
        // }
        
    },

    createPages: async function(req, res){
        let content = [];
        content.push({
            view: 'createPages',
            data: {}
        });

        res.render('admin/shopmanager', { content: content });
    }
}

module.exports = PagesController;