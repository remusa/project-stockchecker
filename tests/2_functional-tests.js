/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)

suite('Functional Tests', function() {
    suite('GET /api/stock-prices => stockData object', function() {
        test('1 stock', function(done) {
            chai.request(server)
                .get('/api/stock-prices')
                .query({ stock: 'goog' })
                .end(function(err, res) {
                    //complete this one too
                    assert.equal(res.status, 200)
                    assert.isObject(
                        res.body,
                        'stockData respose should be object'
                    )
                    assert.isNotArray(
                        res.body.stockData,
                        'stockData response should not be an array'
                    )
                    assert.property(
                        res.body,
                        'stockData',
                        'stockData is an object'
                    )
                    assert.property(
                        res.body.stockData,
                        'stock',
                        'stockData has stock property'
                    )
                    assert.property(
                        res.body.stockData,
                        'price',
                        'stockData has price property'
                    )
                    assert.property(
                        res.body.stockData,
                        'likes',
                        'stockData has likes property'
                    )
                    assert.equal(res.body.stock, 'GOOG')
                    done()
                })
        })

        test('1 stock with like', function(done) {
            chai.request(server)
                .get('/api/books')
                .query({ stock: 'goog', like: true })
                .end(function(err, res) {
                    //complete this one too
                    assert.equal(res.status, 200)
                    assert.isObject(
                        res.body,
                        'stockData respose should be object'
                    )
                    assert.isNotArray(
                        res.body.stockData,
                        'stockData response should not be an array'
                    )
                    assert.property(
                        res.body,
                        'stockData',
                        'stockData is an object'
                    )
                    assert.property(
                        res.body.stockData,
                        'stock',
                        'stockData has stock property'
                    )
                    assert.property(
                        res.body.stockData,
                        'price',
                        'stockData has price property'
                    )
                    assert.property(
                        res.body.stockData,
                        'likes',
                        'stockData has likes property'
                    )
                    assert.equal(res.body.stockData.stock, 'GOOG')
                    assert.equal(res.body.stockData.likes, 1)
                    done()
                })
        })

        test('1 stock with like again (ensure likes arent double counted)', function(done) {
            chai.request(server)
                .get('/api/stock-prices')
                .query({ stock: 'goog', like: true })
                .end(function(err, res) {
                    assert.equal(res.status, 200)
                    assert.isObject(
                        res.body,
                        'stockData respose should be object'
                    )
                    assert.isNotArray(
                        res.body.stockData,
                        'stockData response should not be an array'
                    )
                    assert.property(
                        res.body,
                        'stockData',
                        'stockData is an object'
                    )
                    assert.property(
                        res.body.stockData,
                        'stock',
                        'stockData has stock property'
                    )
                    assert.property(
                        res.body.stockData,
                        'price',
                        'stockData has price property'
                    )
                    assert.property(
                        res.body.stockData,
                        'likes',
                        'stockData has likes property'
                    )
                    assert.equal(res.body.stockData.stock, 'GOOG')
                    assert.equal(res.body.stockData.likes, 1)
                    done()
                })
        })

        test('2 stocks', function(done) {
            chai.request(server)
                .get('/api/books')
                .query({ stock: ['goog', 'fb'] })
                .end((req, res) => {
                    assert.equal(res.status, 200)
                    assert.isArray(res.body, 'response should be array')
                    assert.isObject(
                        res.body.stockData[0],
                        'response first element should be object'
                    )
                    assert.isObject(
                        res.body.stockData[1],
                        'response second element should be object'
                    )
                    assert.property(
                        res.body.stockData[0],
                        'stock',
                        'stockData has stock property'
                    )
                    assert.property(
                        res.body.stockData[0],
                        'price',
                        'stockData has price property'
                    )
                    assert.property(
                        res.body.stockData[0],
                        'rel_likes',
                        'stockData has rel_likes property'
                    )
                    assert.property(
                        res.body.stockData[1],
                        'stock',
                        'stockData has stock property'
                    )
                    assert.property(
                        res.body.stockData[1],
                        'price',
                        'stockData has price property'
                    )
                    assert.property(
                        res.body.stockData[1],
                        'rel_likes',
                        'stockData has rel_likes property'
                    )
                    assert.equal(res.body.stockData[0].stock, 'GOOG')
                    assert.equal(res.body.stockData[0].rel_likes, 1)
                    assert.equal(res.body.stockData[1].stock, 'FB')
                    assert.equal(res.body.stockData[1].rel_likes, 1)
                    done()
                })
        })

        test('2 stocks with like', function(done) {
            chai.request(server)
                .get('/api/books')
                .query({ stock: ['goog', 'fb'], like: true })
                .end((req, res) => {
                    assert.equal(res.status, 200)
                    assert.isArray(res.body, 'response should be array')
                    assert.isObject(
                        res.body.stockData[0],
                        'response first element should be object'
                    )
                    assert.isObject(
                        res.body.stockData[1],
                        'response second element should be object'
                    )
                    assert.property(
                        res.body.stockData[0],
                        'stock',
                        'stockData has stock property'
                    )
                    assert.property(
                        res.body.stockData[0],
                        'price',
                        'stockData has price property'
                    )
                    assert.property(
                        res.body.stockData[0],
                        'rel_likes',
                        'stockData has rel_likes property'
                    )
                    assert.property(
                        res.body.stockData[1],
                        'stock',
                        'stockData has stock property'
                    )
                    assert.property(
                        res.body.stockData[1],
                        'price',
                        'stockData has price property'
                    )
                    assert.property(
                        res.body.stockData[1],
                        'rel_likes',
                        'stockData has rel_likes property'
                    )
                    assert.equal(res.body.stockData[0].stock, 'GOOG')
                    assert.equal(res.body.stockData[0].rel_likes, 1)
                    assert.equal(res.body.stockData[1].stock, 'FB')
                    assert.equal(res.body.stockData[1].rel_likes, 1)
                    done()
                })
        })
    })
})
