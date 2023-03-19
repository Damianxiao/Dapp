require('babel-register');
require('babel-polyfill'); // 引用蜡烛图
require('dotenv').config();//拾起.env 文件 将环境变量注入到truffle
module.exports = {
//设置区块链网络，这里是ganache的本地区块链网络
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },

  },
  contracts_directory: './src/contracts/', //改变智能合约存放位置
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer:{
        unabled:true,
        runs:200
      }
    }
  }
};
