const express   = require("express");
const app       = express();
const bp        = require("body-parser");
const qr        = require("qrcode");
const client    = require("./dbHidden");
const routes    = require('./routes');


app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.use('/', routes);

app.get("/", (req, res) => {
    res.render("index");
});

app.use('/order', routes);

app.get("/qrcode", async (req, res) => {
    try {
        const results = await client.query(`select url from qrcodes where order_id = '${req.query.order_id}'`);
        const qrcodeURL = results.rows[0].url;
        
        qr.toDataURL(qrcodeURL, (err, qrcode) => {
            if (err) {
                res.send(`Error occured: ${err}`);
            }
            res.render("qrcode", {qrcode}) 
        });
    } catch (err) {
        console.log(err);
    }
});

app.get("/allorders", async (rec, res) => {
    try {
        const getOrders = await client.query('SELECT * FROM ORDERS');
        const allOrders = getOrders.rows;
        res.render("orders", {allOrders});
    } catch (err) {
        console.log(err);
    }
})

app.post("/deleteorders", async (rec, res) => {
    try {
        const deleteOrders = await client.query('delete from orders');
        res.render("index");
    } catch (err) {
        console.log(err);
    }
})




const PORT = 5000;
app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT}`));