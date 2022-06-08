const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const { DOMAIN_API } = process.env;

const auth = {
    checkLoginClient: async (req, res, next) => {
        if (req.cookies.token) next();
        else res.redirect('/account/login');
    },

    checkLoginAdmin: async (req, res, next) => {
        const info = jwt.decode(req.cookies.tokenAdmin);
        if (!req.cookies.tokenAdmin) {
            res.redirect('/admin/login');
        } else {
            let user = await axios.post(DOMAIN_API + '/getoneaccount', {
                id: info.id
            });
            if (user.data.info.Role == 'admin') {
                next();
            } else {
                res.clearCookie('tokenAdmin');
                res.redirect('/admin/login');
            }
        }
    }
};

module.exports = auth;
