const { Router } = require("express");
const { TokenVerification } = require("../middlewares/TokenHandeler");
const { GetUserData } = require("../middlewares/GetUserData");
const DashboardControllers = require("../controllers/DashboardControllers");

const router = new Router();

router.get(
  "/Dashboard/data",
  TokenVerification,
  GetUserData,
  DashboardControllers.GetUserData
);

router.get(
  "/Dashboard/stats",
  TokenVerification,
  GetUserData,
  DashboardControllers.GetUserStats
);

router.get(
  "/Dashboard/products",
  TokenVerification,
  GetUserData,
  DashboardControllers.GetUserProducts
);

module.exports = router;
