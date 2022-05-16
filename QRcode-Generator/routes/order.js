const client    = require("../dbHidden");
const qr        = require("qrcode");

module.exports = {
    getOrder: async function (req, res) {
        const orderID = req.query.id;
        try {
            const results = await client.query(`select * from orders where id = '${orderID}'`);
            const getUrl    = await client.query(`select url from qrcodes where order_id = '${orderID}'`);
            const url       = getUrl.rows[0].url;
            const orderObject = results.rows[0];
    
            qr.toDataURL(url, (err, qrcode) => {
                if (err) {
                    console.log(err);
                }
                res.render("order", {orderObject, qrcode}) 
            });
        } catch (err) {
            console.log(err);
        }
    },
    postOrder: async function (req, res) {
        const orderObject   = req.body;
    
        try {
            const postOrderToDB = await client.query(`
                                                        with rows as (
                                                        INSERT INTO orders (items, price, date_created)
                                                        VALUES ('${orderObject.itemName}', ${orderObject.price}, NOW()) RETURNING id)
                                                        INSERT INTO qrcodes (order_id, url)
                                                        SELECT id, CONCAT('http://localhost:5000/order/?id=', id)
                                                        FROM rows
                                                        RETURNING order_id, url;
                                                    `);
    
            orderObject.url = postOrderToDB.rows[0].url;
            orderObject.id  = postOrderToDB.rows[0].order_id;
            
            qr.toDataURL(orderObject.url, (err, qrcode) => {
                if (err) {
                    console.log(err);
                }
                res.render("order", {orderObject, qrcode}) 
            });
        } catch (err) {
            console.log(err);
        }
    }
}