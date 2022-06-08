const axios = require('axios');
const jwt = require('jsonwebtoken');

const { DOMAIN_API } = process.env;

const NewsController = {
    clientList: async function(req, res){
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

        let listNews = await axios.get(DOMAIN_API + '/getallbypage/' + req.query.page ||1);

        console.log(listNews.data);
        let content = [];
        content.push({
            view: 'blog/list',
            data: { listNews: listNews.data }
        });

        

        res.render('index', {
            content: content,
            info: info,
            category: category.data,
            cart: cart,
            products: products,
            url: process.env.DOMAIN_NAME + '/news',
            slider: false
        });
    },

    detail: async function(req, res){
        let slug = req.params.slug;
        let news = await axios.get(DOMAIN_API + '/getonenewslug/' + slug);
        console.log(news.data);
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
            view: 'blog/detail',
            data: { news: news.data.info }
        });

        

        res.render('index', {
            content: content,
            info: info,
            category: category.data,
            cart: cart,
            products: products,
            url: process.env.DOMAIN_NAME + '/news',
            slider: false
        });

    },

    adminList: async function(req, res){
        let page = req.query.page || 1;
        let news = await axios.get(DOMAIN_API + '/getallbypage/'+page);
        console.log(news.data);
        let content = [];
        content.push({
            view: 'listnews',
            data: { news: news.data }
        });
        res.render('admin/shopmanager', { content: content });
    },
    
    createNews: async function(req,res){
        let allCategories = await axios.get(DOMAIN_API + '/getallcategory');
        let allImage = await axios.get(DOMAIN_API + '/getallimage');
        let content = [];
        content.push({
            view: 'createNews',
            data: {
                allImage: allImage.data,
                category: allCategories.data.listCategory
            }
        });

        res.render('admin/shopmanager', { content: content });
    },

    doCreateNews: async function(req,res){
        let info = jwt.decode(req.cookies.tokenAdmin);
        let { title, editor1, avatar, status} = req.body;
        let news = await axios.post(DOMAIN_API + '/creatnews',{
            nTitle: title,
            nAvatar: avatar,
            nBody: editor1,
            nCategory: req.body['cate[]'],
            nAuthor: info.name,
            nStatus: status
        })
        // if(news.data.status == 'success'){
        //     res.redirect('/admin/news');
        // }
        res.json(news.data);
    },

    editNews: async function(req, res){
        let { id } = req.params;
        let allCategories = await axios.get(DOMAIN_API + '/getallcategory');    
        let allImage = await axios.get(DOMAIN_API + '/getallimage');
        let news = await axios.get(DOMAIN_API + '/getonenews/' + id);
        let content = [];
        content.push({
            view: 'editNews',
            data: {
                news: news.data.info,
                allImage: allImage.data,
                category: allCategories.data.listCategory
            }
        });

        res.render('admin/shopmanager', { content: content });
    },

    doEditNews: async function(req, res){
        let { title, editor1, avatar, status} = req.body;
        let news = await axios.post(DOMAIN_API + '/editnews/' + req.params.id,{
            nTitle: title,
            nAvatar: avatar,
            nBody: editor1,
            nCategory: req.body['cate[]'],
            nStatus: status
        });
        // if(news.data.status == 'success'){
        //     // res.redirect('/admin/news')
            
        // }
        res.json(news.data);
        console.log(news.data);
    }
}


module.exports = NewsController; 