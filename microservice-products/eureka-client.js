const Eureka = require('eureka-js-client').Eureka;

const client = new Eureka({
  instance: {
    app: 'PRODUCTS-SERVICE',
    hostName: 'products-service',
    ipAddr: '172.20.0.1',
    port: {
      '$': 3000,
      '@enabled': true,
    },
    vipAddress: 'products-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    instanceId: 'products-service:3000',
    statusPageUrl: 'http://products-service:3000/health',
    healthCheckUrl: 'http://products-service:3000/health'
  },
  eureka: {
    host: 'eureka-server',
    port: 8761,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000
  }
});

module.exports = client;