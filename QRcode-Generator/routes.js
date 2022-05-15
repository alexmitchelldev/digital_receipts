const express   = require('express');
const index     = require('./index');
const orders    = require('./orders');
const router    = express.Router(); 

router.route('/order')
    .get(orders.getOrder)
    .post(orders.postOrder)

module.exports = router;