const express   = require("express");
const app       = express();
const bp        = require("body-parser");

const client    = require("./dbHidden");
const routes    = require('./startup/routes');


app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.use('/', routes);
app.use('/order', routes);
app.use('/orders', routes);
app.use('/qrcode', routes);

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