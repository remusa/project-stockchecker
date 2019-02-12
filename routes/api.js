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

let likes = [],
    stockData = {},
    arr = [],
    inArr = []

module.exports = function(app) {
    app.route('/api/stock-prices').get(function(req, res) {
        const query = req.query
        const ip = req.headers['referer'].split(',')[0]
        // const ip = req.headers['x-forwarded-for'].split(',')[0]

        let stock = query.stock
        const like = req.query.like || false

        if (stock === '' || stock === undefined) {
            return res
                .status(400)
                .type('text')
                .send('no stock provided')
        }

        if (Array.isArray(stock)) {
            stock = stock.map(item => item.toUpperCase()).join(',')
        } else {
            stock = stock.toUpperCase()
        }

        //API information: https://github.com/AvapiDotNet/Avapi/wiki/BATCH_STOCK_QUOTES

        const API_DATA = {
            function: 'BATCH_STOCK_QUOTES',
            symbols: stock,
            apikey: process.env.API_KEY,
        }

        // const fetchData = `${URL}function=${API_DATA.function}&symbols=${API_DATA.symbols}&apikey=${
        //     API_DATA.apikey
        // }`
        const fetchData = `${URL}function=${API_DATA.function}&symbols=${API_DATA.symbols}&apikey=${
            API_DATA.apikey
        }`

        fetch(fetchData)
            .then(response => response.json())
            .then(data => {
                arr = data['Stock Quotes'].map(item => ({
                    stock: item['1. symbol'],
                    price: item['2. price'],
                }))

                if (arr.length === 0) {
                    return res
                        .status(400)
                        .type('text')
                        .send('incorrect input')
                }
            })
            .then(() => {
                arr.forEach(item => {
                    MongoClient.connect(CONNECTION_STRING, (err, db) => {
                        db.collection('stock').findOne({ stockName: item.stock }, (err, docs) => {
                            if (err) throw err

                            if (docs === null) {
                                db.collection('stock').insertOne(
                                    {
                                        stockName: item.stock,
                                        likes: like ? 1 : 0,
                                        ip: like ? [ip] : [],
                                    },
                                    (err, doc) => {
                                        if (err) throw err
                                        item.likes = doc.ops[0].likes
                                        sendResponse(res, item)
                                    }
                                )
                            } else {
                                db.collection('stock').findOneAndUpdate(
                                    { stockName: item.stock },
                                    like && docs.ip.indexOf(ip) === -1
                                        ? { $inc: { likes: 1 }, $push: { ip: ip } }
                                        : { $inc: { likes: 0 } },
                                    { returnOriginal: false },
                                    (err, doc) => {
                                        item.likes = doc.value.likes
                                        sendResponse(res, item)
                                    }
                                )
                            }

                            db.close()
                        })
                    })
                })
            })
            .catch(err => console.log(err))

        const sendResponse = (res2, item) => {
            if (arr.length == 1) {
                res2.status(400).json({ stockData: item })
            } else if (arr.length == 2) {
                inArr.push(item)
                if (inArr.length == 2) {
                    inArr[0].rel_likes = inArr[0].likes - inArr[1].likes
                    inArr[1].rel_likes = inArr[1].likes - inArr[0].likes

                    delete inArr[0].likes
                    delete inArr[1].likes

                    res2.status(200).json({ stockData: inArr })
                    inArr = []
                }
            } else {
                return res2
                    .status(400)
                    .type('text')
                    .send('incorrect input')
            }
        }
    })
}
