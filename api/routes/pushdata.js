var express = require('express');
var router = express.Router();

const { InfluxDB } = require('@influxdata/influxdb-client')
const { Point } = require('@influxdata/influxdb-client')

router.post('/pushdata', async function (req, res) {
    console.log(req.body.data);
    data = req.body.data
    let error = false;
    let code = "0x" + data.substring(0, 2);
    let temp = parseInt(data.substring(4, 6), 16);
    let checkValid = parseInt(data.substring(6, 8), 16);
    if (checkValid == "00") error = true;

    // You can generate an API token from the "API Tokens Tab" in the UI
    const token = 'LAIeoZLm4xKm_C7iHbMy90I95zYJg-qMYzbVusluR0aG7IrIad9lKnsWL7Invb1Wwok2hZxEWQNeMnCFX55daQ==';
    const org = 'openit';
    const bucket = 'clermont';
    const client = new InfluxDB({ url: 'http://localhost:8086', token: token });

    const writeApi = client.getWriteApi(org, bucket);
    writeApi.useDefaultTags({ host: 'host1' });

    if (error) {
        const codePoint = new Point("trame-error").stringField('code', code);
        writeApi.writePoint(codePoint);
    } else {
        const tempPoint = new Point("trame-running").intField('temp', temp);
        const codePoint = new Point("trame-running").stringField('code', code);

        writeApi.writePoint(tempPoint);
        writeApi.writePoint(codePoint);
    }

    writeApi
        .close()
        .then(() => {
            console.log('FINISHED')
        })
        .catch(e => {
            console.error(e)
            console.log('Finished ERROR')
        })
});

module.exports = router;