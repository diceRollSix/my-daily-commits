module.exports = {
    baseUrl: process.env.NODE_ENV === 'production'
        ? '/my-daily-commits/'
        : '/'
    ,
    configureWebpack: {
        watchOptions: {
            aggregateTimeout: 300,
            poll: 600
        }
    }
};
