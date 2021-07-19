
const braintree = require("braintree");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

app.listen(port, () => {
    console.log("Port is listening");
});

const gateway = new braintree.BraintreeGateway({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'xc46m64sjdtxj7g9',
    publicKey:    's3ky489md3dtjd6z',
    privateKey:   '0b8950e38e66477c998853ae542c339b'
});

app.get("/client_token", (req, res) => {
    gateway.clientToken.generate({
        //
    }, function(err, response){
        const clientToken = response.clientToken;
        res.send(clientToken);
    });
});

app.post("/checkout", (req, res) => {

    var nonceFromTheClient = req.body.payment_method_nonce;
    var deviceDataFromTheClient = req.body.device_data;
    
    gateway.transaction.sale({
        amount: "10.00",
        paymentMethodNonce: nonceFromTheClient,
        deviceData: deviceDataFromTheClient,
        options: {
            submitForSettlement: true
        }
    }, (err, result) => {
        if(err) {
            console.log(err);
        }

        if(result.success) {
            res.send(result);
        }
        else{
            res.send(result.success);
        }
    });
});