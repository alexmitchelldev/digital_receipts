const express   = require('express');
const router    = express.Router();

const index     = require('../routes/index');
const order     = require('../routes/order');
const orders    = require('../routes/orders');
const qrcode    = require('../routes/qrcode');

router.route('/')
    .get(index.getHome)

router.route('/order')
    .get(order.getOrder)
    .post(order.postOrder)

router.route('/orders')
    .get(orders.getOrders)
    .delete(orders.deleteOrders)

router.route('/qrcode')
    .get(qrcode.getQRCode)

module.exports = router;