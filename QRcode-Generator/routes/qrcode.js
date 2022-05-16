const client    = require("../dbHidden");
const qr        = require("qrcode");


module.exports = {
    getQRCode: async function (req, res) {
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
    }
}