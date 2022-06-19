const express = require('express')
const router = express()
const [CANTEEN, ORDER] = require('./database')
const [options] = require('./logics/updateOptions')
const {checkGreatestOrder} = require('./logics/orderNumbering')

/**
 * requires logic check for order list against canteen menu
 * requires expiry date note this will have to come from database
 * requires user warnings
 */
router.post('/new-order', (req, res)=>{
       

        ORDER.find({}, (err1, found1)=>{ 
            if(err1)
                res.sendStatus(500)
            else if(!found1)
                res.status(500).send('missing documents')
            else if(found1) {
                if(Object.keys(found1).length === 0){
                    saveOrder(0)
                    res.send({orderNumber : 0})
                }  
                else {
                    saveOrder(found1[found1.length - 1].orderNumber + 1)
                    res.send({orderNumber : found1[found1.length - 1].orderNumber + 1})
                }
            }
        })

        function saveOrder(val){
            const data = {
                orderNumber : val,
                canteen : req.body.canteen,
                orderList : req.body.orderList,
                orderDate : Date.now()
            }
            const order = new ORDER(data)
            order.save(err=>{
                if(err)
                    res.status(500).send('unable to save')
            })
        }
    
})

router.get('/canteen-order/:canteen', (req,res)=>{
    console.log(req.params.canteen)
    ORDER.find({canteen : req.params.canteen}, (err, found)=>{
        if(err)
            res.sendStatus(500)
        else if(!found)
            res.sendStatus(404)
        else
            res.send(found)
    })
})

router.post('/order-active/:oid',(req, res)=>{
    const data = {
        active : req.body.active
    }
    ORDER.findOneAndUpdate({_id : req.params.oid}, data, options, (err, found)=>{
        if(err)
            res.sendStatus(500)
        else if(!found)
            res.sendStatus(404)
        else 
            res.sendStatus(200)
    })
})

router.delete('/order-wipe', (req, res)=> {
    ORDER.remove({}, (err, found)=> {
        if(err)
            res.sendStatus(500)
        else if(!found)
            res.sendStatus(404)
        else
            res.sendStatus(200)
    })
})

module.exports = router