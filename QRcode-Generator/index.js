const express   = require("express");
const app       = express();
const bp        = require("body-parser");
const qr        = require("qrcode");
const client    = require("./db");

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/order", async (req, res) => {
    const orderObject   = req.body;
    const qrcodeURL     = `http://localhost:5000/orders/?id=${orderObject.orderID}`;
    try {
        const postOrderToDB = await client.query(`
                                                with rows as (
                                                    INSERT INTO orders (items, price) VALUES ('${orderObject.itemName}', ${orderObject.price}) RETURNING id
                                                    )
                                                    INSERT INTO qrcodes (order_id, url)
                                                    SELECT id, CONCAT('http://localhost:5000/orders/?id=', id)
                                                    FROM rows
                                                    RETURNING url;
                                                `);
        const qrcodeURL = postOrderToDB.rows[0].url;
        console.log(qrcodeURL);
        qr.toDataURL(qrcodeURL, (err, qrcode) => {
            if (err) {
                res.send(`Error occured: ${qrcode}`);
            }
            res.render("order", {orderObject, qrcode}) 
        });
    } catch (err) {
        console.log(err);
    }

});

app.get("/orders", async (req, res) => {
    const orderID = req.query.id;
   
    try {
        const results = await client.query(`select * from orders where id = ${orderID}`);
        res.json(results.rows);
    } catch (err) {
        console.log(err);
    }
});

app.get("/qrcode", async (req, res) => {
    console.log(req.query);

    try {
        const results = await client.query(`select url from qrcodes where order_id = ${req.query.order_id}`);
        res.json(results.rows);
    } catch (err) {
        console.log(err);
    }
});

app.post("/deleteorders", async (rec, res) => {
    try {
        const deleteOrders = await client.query('delete from orders');
        res.render("index");
    } catch (err) {
        console.log(err);
    }
})




const port = 5000;
app.listen(port, () => console.log("Server started: http://localhost:5000"));