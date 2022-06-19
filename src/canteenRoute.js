const express = require('express')
const router = express.Router()
const [CANTEEN, ORDER] = require('./database')
const [options] = require('./logics/updateOptions')


router.get('/all', (req,res)=>{
    CANTEEN.find({}, (err, found)=>{
        if(err)
            res.sendStatus(500)
        else if(!found)
            res.sendStatus(404)
        else{
            const data = []
            found.forEach(el => {
                data.push({
                    name : el.name,
                    cid : el._id
                })
            });
            res.send(data)
        } 
            
    })
})
 

router.post('/creates', (req, res)=>{
    const data = {
        name : req.body.name,
        sid : req.body.sid,
        phone : req.body.phone,
        password : req.body.password
    }
    // console.log(data)
    const canteen = new CANTEEN(data)
    canteen.save(err=>{
        console.log(err)
        if(err)
            res.sendStatus(500)
        else
            res.sendStatus(200) 
        
    })
})

router.get('/login', (req, res)=> {
    
    const query = {
        $and : [
            {
                sid : req.query.sid
            },
            {
                password : req.query.password
            }
        ]
    }

    CANTEEN.findOne(query, (err, found)=>{
        if(err)
            res.sendStatus(500)
        else if(!found)
            res.sendStatus(404) 
        else
            res.send(found._id)
    })
})

router.post('/opens/:cid',(req, res)=>{
    const checker = {
        _id : req.params.cid
    }
    const data = {
        open : req.body.open
    }

    CANTEEN.findOneAndUpdate(checker, data, options, (err, found)=>{
        if(err)
            res.sendStatus(500)
        else if(!found)
            res.sendStatus(404)
        else
            res.sendStatus(200)
    })
})

router.post('/new-order/:cid', (req, res)=>{
    const data = {
        orderNumber : req.body.orderNumber
    }

    const action = {
        $push : {
            orderNumbers : data.orderNumber
        }
    }
    const checker = {
        _id : req.params.cid
    }

    CANTEEN.findOneAndUpdate(checker, action, options, (err, found)=>{
        if(err)
            res.sendStatus(500)
        else if(!found)
            res.sendStatus(404) 
        else
            res.sendStatus(200)
    })
})

router.post('/remove-order/:cid', (req, res)=>{
    const data = {
        orderNumber : req.body.orderNumber
    }

    const action = {
        $pull : {
            orderNumbers : data.orderNumber
        }
    }
    const checker = {
        _id : req.params.cid
    }

    CANTEEN.findOneAndUpdate(checker, action, options, (err, found)=>{
        if(err)
            res.sendStatus(500)
        else if(!found)
            res.sendStatus(404)
        else
            res.sendStatus(200)
    })
}) 

router.post('/add-menu', (req, res)=>{  

    const data = {
        cid : req.body.cid,
        type : req.body.type,
        name : req.body.name,
        totalStocks : req.body.totalStocks,
        price : req.body.price
    }
    var action = {}
    if(data.type === 'snacks'){
         action = {
            $push : {
                snacks : {
                    name : data.name,
                    totalStocks : data.totalStocks,
                    usedStocks : 0,   
                    price : data.price
                }
            }
        }
    }

    if(data.type === 'drinks'){
        action = {
            $push : {
                drinks : {
                    name : data.name,
                    totalStocks : data.totalStocks,
                    usedStocks : 0,
                    price : data.price
                }
            }
        }
    }
    CANTEEN.findOneAndUpdate({_id : data.cid}, action, options, (err, found)=>{
        if(err)
            res.sendStatus(500)
        else if(!found)
            res.sendStatus(404)
        else
            res.sendStatus(200)
    })
})

router.get('/:cid', (req, res)=>{
    CANTEEN.findOne({_id: req.params.cid}, (err, found)=>{
        if(err) 
            res.sendStatus(500)
        else if(!found)
            res.sendStatus(404)
        else{
            const data = {
                name : found.name,
                drinks : found.drinks,
                snacks : found.snacks
             }
            //  console.log(data)
                 res.send(data)
        }
        
    })
})

// update drinks or snacks
router.post('/update-menu', (req, res) => {
    const data = {
        canteen : req.body.canteen,
        type : req.body.type,
        name : req.body.name,
        usedStocks : req.body.usedStocks
    }


    if(data.type === 'snacks'){
        const query = {
          name : data.canteen,
          "snacks.name" : data.name
        }
        const action = { 
            $inc : {
                    'snacks.$.usedStocks' : data.usedStocks  
            }
        }
        const callback = (err, found)=>{
            if(err)
                res.sendStatus(500)
            else if(!found)
                res.status(404).send('canteen or menu not found')
            else
                res.sendStatus(200)
        }
        CANTEEN.findOneAndUpdate(query, action, options, callback)
        
    }

    else if(data.type === 'drinks'){
        const query = {
            name : data.canteen,
            "drinks.name" : data.name
          }
          const action = { 
              $inc : {
                      'drinks.$.usedStocks' : data.usedStocks  
              }
          }
          const callback = (err, found)=>{
              if(err)
                  res.sendStatus(500)
              else if(!found)
                  res.status(404).send('canteen or menu not found')
              else
                  res.sendStatus(200)
          }
          CANTEEN.findOneAndUpdate(query, action, options, callback)
    }
    
})


//delete zero value menu
// bug
router.post('/delete-menu',(req, res)=> {
   
   
    const query = {
        name : req.body.canteen,
        'snacks.usedStocks' : {
            $gte : 1
        },
        'drinks.usedStocks' : {
            $gte : 1
        }
    }
    const action = {
        $pullAll : {
            $or : [
                {
                    'snacks.$.usedStocks' : {
                        $gte : 'snacks.$.totalStocks'
                    } 
                },
                {
                    'drinks.$.usedStocks' : {
                        $gte : 'drinks.$.totalStocks'
                    }
                }
            ]
        }
       
    }

    const callback = (err, found) => {
        if(err)
              res.sendStatus(500)
          else if(!found)
              res.status(404).send('deletion failed')
          else
              res.sendStatus(200)
    }
    CANTEEN.findOneAndUpdate(query, action, options, callback)
})

module.exports = router