const Counter = require('../models/counter');

const getNextSequence = async (sequenceName) => {
    const counter = await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // Create the document if it doesn't exist
    );
    return counter.seq;
};

module.exports = { getNextSequence };