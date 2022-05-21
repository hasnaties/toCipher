const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_CONNECTION, {

    useNewUrlParser: true
    
}).catch((error) => {
    console.log('Mongoose Error: ', error);
    throw new Error({
        Error: error,
        type: 'Mongoose Connection'
    })
})