const express = require("express");

const {
  updateNickname,
  updateAge,
  updateGender,
  updateBio,
  updateImage,
} = require("../controllers/profileController");

const router = express.Router();

router.post("/nickname", updateNickname);
router.post("/age", updateAge);
router.post("/gender", updateGender);
router.post("/bio", updateBio);
router.post("/image", updateImage);

module.exports = router;
