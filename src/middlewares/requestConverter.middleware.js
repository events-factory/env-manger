function requestConverter(req, res, next) {
    const contentType = req.headers['content-type'];
    switch (contentType) {
      case 'application/json':
        req.body.respond_with = 'json';
        next();
        break;
      case 'application/xml':
        req.body.respond_with = 'xml';
        Object.entries(req.body.brd).forEach(([key, value]) => {
          req.body[key] = value[0]
        });
        Object.entries(req.body.brd["$"]).forEach(([key, value]) => {
          req.body[key] = value
        });
        delete req.body.brd;
        next();
        break;
      default:
          res.status(415).send({ status: 'error', message: 'Unsupported request Type.' });
          break;
    }

}

module.exports = { requestConverter };