const express = require("express");
const router = express.Router();
const {
  updateNickname,
  updateAge,
  updateGender,
  updateBio,
  updateImage,
  getProfileInfo,
} = require("../controllers/profileController");

router.post("/nickname", updateNickname);
router.post("/age", updateAge);
router.post("/gender", updateGender);
router.post("/bio", updateBio);
router.post("/image", updateImage);


router.get("/getprofileinfo", getProfileInfo);

module.exports = router;
