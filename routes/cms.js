var express = require('express');
var router = express.Router();


router.get("/cms", function(req, res){

    res.render("cms/index");

});

module.exports = router;