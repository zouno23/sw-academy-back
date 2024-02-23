const setCache = (req, res, next) => {
  const periode = 60 * 5;
  if (req.method == "GET") {
    res.set("Cache-controle", `public , max-age=${periode}`);
  } else {
    res.set("Cache-controle", `no-store`);
  }

  next();
};

module.exports = setCache;
