

const mongoose = require('mongoose');
const logger = require('../utils/logger');


module.exports = function () {
    const local_db_url = process.env.local_db_url
    mongoose.connect(local_db_url).then(logger.info("database is running"))

}