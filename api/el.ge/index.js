const router = require('express').Router();

router.get('/search/:term/:page/:numberOfPages', (req, res) => {
  require('./func/results').main(encodeURI(req.params.term), req.params.page, result => {
    res.json(result);
  });
})
router.get('/stats/:term', (req, res) => {
  require('./func/stats').main(encodeURI(req.params.term), result => {
    switch(result){
      case "Nothing found":
        res.status('204').end(); //search returned no results;
        break;
      default:
        res.json(result);
        break;
    }
  });
})
router.get('/bookcount', (req, res) => {
  require('./func/bookcount').main(result => {
    res.json(result);
  });
})
module.exports = router;