/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict'

const expect = require('chai').expect
const MongoClient = require('mongodb')
const fetch = require('node-fetch')

const CONNECTION_STRING = process.env.DB //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const URL = 'https://www.alphavantage.co/query?'
// const URL = 'https://finance.google.com/finance/info?q=NASDAQ%3a'

module.exports = function(app) {
    app.route('/api/stock-prices').get(function(req, res) {
        const query = req.query
        const ip = req.headers['referer'].split(',')[0] //'x-forwarded-for'
        console.log(query)
        console.log(ip)

        let stock = query.stock

        if (stock === '' || stock === undefined) {
            return res
                .status(400)
                .type('text')
                .send('no stock provided')
        }

        if (Array.isArray(stock)) {
            stock.map(item => item.toUpperCase())
        } else {
            stock = stock.toUpperCase()
        }

        //API information: https://github.com/AvapiDotNet/Avapi/wiki/BATCH_STOCK_QUOTES

        const API_DATA = {
            function: 'BATCH_STOCK_QUOTES',
            symbols: stock.join(','),
            apikey: process.env.API_KEY,
        }

        const fetchData = `${URL}function=${API_DATA.function}&symbols=${
            API_DATA.symbols
        }&apikey=${API_DATA.apikey}`

        fetch(fetchData)
            .then(res => res.json())
            .then(data => console.log(data))

        //  {"stockData":{"stock":"GOOG","price":"786.90","likes":1}}
        // const stockData = {}

        // return res.status(200).json(stockData)
    })
}
