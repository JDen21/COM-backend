const [CANTEEN, ORDER, STAFF] = require('../database.js')

const checkGreatestOrder = new Promise( (res, rej) => {
    ORDER.find( {}, (err, found)=> {
        if(err){
            rej('something went wrong')
        }
        else if(!found){
            rej('missing documents')
         }
        else if(Object.keys(found).length === 0){
            res(0)
        }
        else {
            // console.log(found[found.length - 1].orderNumber)
            res(found[found.length - 1].orderNumber)
        }
            
    })    
})


// console.log(checkGreatestOrder())  
module.exports = {checkGreatestOrder}