const path = require('path')
const ObjectId = require("mongodb").ObjectId;
require('dotenv').load({path: path.join(process.cwd(), '.env.development')})
const mongoConnect = require('../lib/mongo/connect').connect
const _ = require('lodash')



async function main() {

    const client = await mongoConnect()
    console.log('Connected successfully to server')

    const dbName = process.env.DB_NAME || (console.error('no db'), process.exit(1))

    global.db = client.db(dbName)


    const count = await global.db.collection('orders').countDocuments()

    console.log('count', count)
    const mappedOrders = arr.map(i => mapMongoToOrder(i))
    const uOrders = _.uniqBy(mappedOrders, 'id')

    const orders = uOrders.map(async (order) => {

        return await global.db.collection('orders')
            .findOneAndUpdate({id: order.id}, {$setOnInsert: order}, {upsert: true})

    })
    const count1 = await global.db.collection('orders').countDocuments()

    console.log('count after', count1)
    return orders
}

main()


function mapMongoToOrder(_order) {

    delete _order.updated_at
    delete _order.completed_at
    delete _order.complete
    delete _order.date
    const _id = ObjectId(_order._id.$oid)

    let acknowledged_at = null;

    if (_order.hasOwnProperty('acknowledged_at')) {
        if (_order.acknowledged_at.hasOwnProperty('$date')) {

            acknowledged_at = new Date(_order.acknowledged_at.$date)
        }
    }
    return Object.assign(_order, {
        _id,
        acknowledged_at

    })

}