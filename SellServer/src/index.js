const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const appData = require('./data.json')
const seller = appData.seller
const goods = appData.goods
const ratings = appData.ratings
// 初始化body解析器
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
const apiRoutes = express.Router()
apiRoutes.get('/seller', function(request, response) {
  response.json({
    code: 0,
    data: seller
  })
})
apiRoutes.get('/goods', function(request, response) {
  response.json({
    code: 0,
    data: goods
  })
})
apiRoutes.get('/ratings', function(request, response) {
  response.json({
    code: 0,
    data: ratings
  })
})
// 挂载到 /api
app.use('/api', apiRoutes)
// 启动监听
app.listen(2999)
