const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const { DOMAIN_API, DOMAIN_SERVER } = process.env;

const OpinionController = {
    list: async function(req, res){
        let listContact = await axios.get(DOMAIN_API + '/getallcontact/?page=' + (req.query.page || 1) + '&perPage=' + (req.query.perPage || 10));
        let content = [];
        content.push({
            view: 'listContact',
            data: {contact: listContact.data}
        });

        res.render('admin/shopmanager', { content: content });
    },

    store: async function(req, res){
        let opinion = await axios.post(DOMAIN_API + '/contact', {
            Name: req.body.name,
            Email: req.body.email,
            NumberPhone: req.body.numberphone,
            Detail: req.body.noidung
        });
        console.log(opinion.data);
        res.redirect('/');
    }
}

module.exports = OpinionController;