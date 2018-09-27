let  fetch = require('isomorphic-fetch');
let  url = "https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=0x4f77b7126bc60af8dde3b91c3e4ed281401862ff&startblock=0&endblock=99999999&sort=asc&apikey=8ff3c5f5dfbd4635aef76d00ca94058c";
fetch(url)
    .then(res => {
        return res.json();
        console.log(res.json)
    })
    .then(res => {
        console.log(res.result);
    })
