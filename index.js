const express = require('express')
const cors = require('cors')
const canteen = require('./src/canteenRoute')
const order = require('./src/orderRoute')

const app = express()
const PORT =  3000 || process.env.PORT

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended : true
}))
app.use('/canteen', canteen)
app.use('/order', order) 

app.get('/', (req, res)=>{
    console.log('API works') 
    res.send('API works')
})


app.listen(PORT, ()=>{
    console.log('listening to port: ' + PORT)
})