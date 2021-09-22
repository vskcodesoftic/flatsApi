
const express = require('express');

const router = express.Router();

const adminController = require('../controller/admin-controller')

router.get('/', (req, res, next) => {
 
  res.json({message: 'admin routes'});
});


router.post("/auth/create", adminController.addAdmin);

router.post("/login", adminController.userLogin);

router.post("/addBlock", adminController.addBlock);

router.get("/getBlocks", adminController.geListOfBlocks);


router.post("/addFlat", adminController.addFlat);

router.post("/addFamilyMember", adminController.addFamilyMemberDetails);

router.post("/getDetialsByFlatNumber", adminController.getDetailsbyFlatNumber);

router.post("/getDetialsOfFamilyMembersbyFlatNumber", adminController.getDetailsOfFamilyMembers);


router.post("/getDetailsByFlatNumber", adminController.getFlatsbyBlockNumber);

module.exports = router;