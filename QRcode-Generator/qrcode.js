const qr    = require("qrcode");

const getQrCode = url => {
    qr.toDataURL(url, (err, qrcode) => {
        if (err) {
            return err;
        } else {
            return qrcode;
        }
    });
};

module.exports = getQrCode;