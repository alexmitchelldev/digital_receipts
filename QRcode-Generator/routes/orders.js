const client    = require("../dbHidden");

module.exports = {
    getOrders: async (rec, res) => {
        try {
            const getOrders = await client.query('SELECT * FROM ORDERS');
            const allOrders = getOrders.rows;
            res.render("orders", {allOrders});
        } catch (err) {
            console.log(err);
        }
    },
    deleteOrders: async (rec, res) => {
        try {
            const deleteOrders = await client.query('delete from orders');
            res.render("index");
        } catch (err) {
            console.log(err);
        }
    }
}