const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const XLSX = require('xlsx');

const { DOMAIN_API, DOMAIN_NAME } = process.env;

const OrderController = {

    //ví dụ download excel
    exportdata: async function (req, res){
        var wb = XLSX.utils.book_new(); 
        let data = await axios.post(DOMAIN_API + '/totalorder',{
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd
        });
        console.log(data.data.length);
        if(data.data.length == 0){
            return res.send('Không có dữ liệu');
        } 
        var temp = JSON.stringify(data.data);
        temp = JSON.parse(temp);
        var ws = XLSX.utils.json_to_sheet(temp);
        var down = `public//export//`;
        var file = `exportdata${Date.now()}.xlsx`;
        console.log(down);
        XLSX.utils.book_append_sheet(wb,ws,"sheet1");
        XLSX.writeFile(wb,down+file);
        res.send(file);
    },

    print: async function (req, res){
        let id = req.params.id;
        let order = await axios.get(DOMAIN_API + '/order/' + id);
        res.render('admin/printorder', { order: order.data });
        
    },

    completeCheckOut: async function (req, res) {
        const { name, email, address, numberphone, paymentmethods } = req.body;
        await axios.post(DOMAIN_API + '/checkout', {
            id: jwt.decode(req.cookies.token).id,
            name,
            email,
            address,
            numberphone,
            paymentmethods
        });

        let category = await axios.get(DOMAIN_API + '/getShowCategory');
        let content = [];
        content.push({
            view: 'pages/confirmation',
            data: {}
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
    },

    orderDetail: async function (req, res){
        let { id } = req.params;
        let order = await axios.get(DOMAIN_API + '/order/' + id);

        let category = await axios.get(DOMAIN_API + '/getShowCategory');
        let content = [];
        content.push({
            view: 'pages/orderdetail',
            data: { productorder: order.data.info.productorder, order: order.data.info.order }
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
    },

    orderConfirmDetail: async function(req, res){
        let id = req.params.id;
        let order = await axios.get(DOMAIN_API + '/orderconfirm/' + id);
        console.log(order.data);
        res.redirect('/account');
    },

    orderList: async function (req, res){
        let order = await axios.get(DOMAIN_API + '/listorder');
        // console.log(order.data);
        let page = req.query.page || 1;
        let content = [];
        content.push({
            view: 'listOrder',
            data: { order: order.data }
        });
        res.render('admin/shopmanager', { content: content });
    },

    editOrder: async function(req, res){
        let id = req.params.id;
        let order = await axios.get(DOMAIN_API + '/order/' + id);
        console.log(order.data.info.order);
        let content = [];
        content.push({
            view: 'editOrder',
            data: { order: order.data }
        });
        res.render('admin/shopmanager', { content: content });
    }
};

module.exports = OrderController;
