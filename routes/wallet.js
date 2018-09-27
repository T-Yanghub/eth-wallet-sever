const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const  fetch = require('isomorphic-fetch');
const hdkey = require('ethereumjs-wallet/hdkey')
const ethUtil = require('ethereumjs-util');
const util = require('util');
const config = require('../config/index');
let bip39 = require('bip39');
const HDWalletProvider = require("truffle-hdwallet-provider");
let provider = new HDWalletProvider(config.mnemonic,config.network);
let web3 = new Web3(provider);



//生成助记词
router.get('/createMnemonic', async(req,res)=>{
    console.log("连接成功");
           try {
               let mnemonic =bip39.generateMnemonic();
               //web3.setProvider(new HDWalletProvider(mnemonic,config.network) );
              // let addrs =await web3.eth.getAccounts();
              // let addr = addrs[0];
               res.success(mnemonic);
           }catch (e) {
               res.fail(e.toString());
           }
});


//根据助记词生成地址
router.post('/getAddress',async (req,res)=>  {

    console.log("连接成功");

    let mnemonic = req.body.mnemonic;

    try {
        web3.setProvider(new HDWalletProvider(mnemonic,config.network) );
        let addresses = await web3.eth.getAccounts();
        let address = addresses[0];

        res.success(address);
    }catch (e){
        res.fail(e.toString());
    }
});



//导出私钥
router.post('/getPrivateKey',(req,res)=>{

    console.log("连接成功");

    let mnemonic = req.body.mnemonic;
    try {
        let seed = bip39.mnemonicToSeed(mnemonic);
        let  hdWallet = hdkey.fromMasterSeed(seed);
        let key = hdWallet.derivePath("m/44'/60'/0'/0/0");
        let privateKey = ethUtil.bufferToHex(key._hdkey._privateKey).toLocaleUpperCase().substring(2);
        res.success(privateKey);
    }catch (e){
        res.fail(e.toString());
    }


});





//转账
router.post('/tranfer',async(req,res)=>{

    console.log("连接成功");

    let mnemonic = req.body.mnemonic
   web3.setProvider(new HDWalletProvider(mnemonic,config.network) );
    let accounts =await web3.eth.getAccounts();
    let from = accounts[0];
   // let from = req.body.from;
    let to = req.body.to;
    let value = req.body.value;
    console.log(req.body);
   let  balance = await  getBalance(from);
   console.log(value);
   console.log(balance)
    let remaining = balance-value;
   console.log(remaining);
   if (remaining>0){
       try {
           let receipt = await web3.eth.sendTransaction({
               from: from,
               to: to,
               value: value,
               gas: '1000000'
           });
           res.success(receipt);
       }catch (e) {

           res.fail(e.toString());
       }
   }else {
       console.log('余额不足');
       res.send("余额不足");
   }


} );





//获取账户余额
router.post('/getBalance',async (req,res)=>{

    console.log("连接成功");

    let addr = req.body.address;
    try {
        let balance =await getBalance(addr);
           console.log('balance:'+balance);
        res.success(balance);
    }catch (e) {
        console.log("获取失败");
  res.fail(e.toString());
    }
});





//获取交易历史
router.post('/getTransactionInfomations',async (req,res)=>{

    console.log("连接成功");

    let  address = req.body.address;

      console.log(address);

    try {

        let infoArr =await  getTransactionInfomations(address);
          console.log(infoArr);
        res.success(infoArr);
    }catch(e) {
        res.fail(e.toString());
    }


});

//充值
router.post('/charge',(req,res)=>{

    console.log("连接成功");

    let  address = req.body.address;
    let  value = req.body.value;
    try {
        let accounts = web3.eth.getAccounts();
        let receipt = web3.eth.sendTransaction({
            from: accounts[0],
            to:address,
            value:value,
            gas: '1000000'
        });

        res.success(receipt);
    }catch (e) {
        res.fail(e.toString());
    }


});




//提币
router.post('/withdraw',(req,res)=>{

    console.log("连接成功");

    let  address = req.body.address;
    let  value = req.body.value;
    try {
        let accounts = web3.eth.getAccounts();
        let receipt = web3.eth.sendTransaction({
            to: accounts[0],
            from:address,
            value:value,
            gas: '1000000'
        });

        res.success(receipt);
    }catch (e) {
        res.fail(e.toString());
    }


});



//获取余额
async function getBalance(addr) {
    let balance = await web3.eth.getBalance(addr);
    return balance
}



//获取交易历史
async function getTransactionInfomations(address) {
    let infoArr;
    let url = `https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=${config.endBlock}&sort=asc&apikey=${config.etherscanAK}`
   //主网为 let url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${config.etherscanAK}`
    await fetch(url)
        .then(res => {
            return res.json();
        })
        .then(res => {
            //  console.log(res.result);
            infoArr =res.result;
        });

   // console.log(infoArr);
    return  infoArr;
}


module.exports=router;