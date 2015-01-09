var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('Respond with a listing of posts');
});

module.exports = router;
