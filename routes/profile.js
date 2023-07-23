const express = require("express");
const router = express.Router();
const {
  updateNickname,
  updateAge,
  updateGender,
  updateBio,
  updateImage,
  getProfileInfo,
  searchByNickname
} = require("../controllers/profileController");

router.post("/updateprofile/nickname", updateNickname);

router.post("/updateprofile/age", updateAge);

router.post("/updateprofile/gender", updateGender);

router.post("/updateprofile/bio", updateBio);

router.post("/updateprofile/image", updateImage);



router.get("/getprofileinfo", getProfileInfo);

router.get("/getprofilebynickname", searchByNickname);

module.exports = router;
