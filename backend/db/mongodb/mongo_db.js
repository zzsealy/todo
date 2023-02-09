'use strict';

const mongoose = require('mongoose')
const config = require('../../utils/config')
const URL = config.MONGODB_URI

mongoose.connect(URL);

const db = mongoose.connection;


db.once('open' ,() => {
	console.info('连接数据库成功');
})

db.on('error', function(error) {
    console.error('数据库连接失败: ' + error);
    mongoose.disconnect();
});

db.on('close', function() {
    console.error('数据库断开，重新连接数据库');
    mongoose.connect(URL, {server:{auto_reconnect:true}});
});

module.exports = db