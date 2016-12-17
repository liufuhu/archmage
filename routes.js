var express 		= require('express');
var router 			= express.Router();
var htmlPage 		= require("./route/page");
var Ajax 			= require("./route/ajax")


router.get('/', htmlPage.index);

router.post('/query', Ajax.query);

router.post('/showCreate', Ajax.showCreate);



module.exports = router;