'use strict';

const mongoose = require('mongoose')
const config = require('../../utils/config')
const {
    DB_HOST,
    MONGODB_PASSWORD,
    MONGODB_USER,
    DB_PORT,
    MONGODB_DATABASE,
} = process.env;
const URL = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${DB_HOST}:${DB_PORT}/${MONGODB_DATABASE}`
// mongodb://todo_admin:drq12345!@127.0.0.1:27017/todo
console.log('=======', URL)

mongoose.connect(URL);

const db = mongoose.connection;


db.once('open' ,() => {
	console.info('连接数据库成功');
})

db.on('error', function(error) {
    console.error('数据库连接失败: ' + error);
    mongoose.disconnect();
});

db.on('close', function () {
    console.log(URL)
    console.error('数据库断开，重新连接数据库');
    mongoose.connect(URL, {server:{auto_reconnect:true}});
});

module.exports = db