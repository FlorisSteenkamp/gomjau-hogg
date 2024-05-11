import express from 'express';


const app = express();
app.enable('trust proxy');


app.use(function(req, res, next) {
    if (req.hostname === 'localhost') { next(); return; }

    // Use below when using our own domain name
    //if (req.get('X-Forwarded-Proto') === 'https' && !req.subdomains.length) {
    //    next(); return;
    //}

    // Use below for a secure appspot domain, e.g. https://kickinjoes.appspot.com
    if (req.get('X-Forwarded-Proto') === 'https') {
        next(); return;
    }

    // Use below when using our own domain name
    // We currently only have the www subdomain
    let hostname = req.hostname.replace(/^www\./i, '');
    // res.redirect(`https://${hostname}${req.originalUrl}`)

    res.redirect(`https://${hostname}${req.originalUrl}`);
});


// Static files handler
app.get('/(*.css)|(*.js)|(*.txt)|(*.xml)|(*.wasm)|(*.pdf)', (req, res) => {
    var fileName = req.url;
    res.sendFile(__dirname + '/static/' + fileName, { maxAge: '0m' });
});


// Static files handler
app.get('(*.jpg)|(*.svg)|(*.png)|(*.ico)|(*.webmanifest)', (req, res) => {
    var fileName = req.url;
    res.sendFile(__dirname + '/static/' + fileName, { maxAge: '30d' });
});


// Static files handler
app.get('(*.woff)|(*.woff2)|(*.otf)|(*.ttf)', (req, res) => {
    var fileName = req.url;
    res.sendFile(__dirname + '/static/' + fileName, { maxAge: '0m' });
});


// Static files handler
app.get('/([\\s\\S]*)|(/)', async (req, res) => {
    res.sendFile(__dirname + '/static/index.html', { maxAge: '5m' });
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});


export { app }
