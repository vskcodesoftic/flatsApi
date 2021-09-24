
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


router.get("/getDetailsByBlockNumber/:bid", adminController.getFlatsbyBlockNumber);

router.get("/getListofFlats", adminController.geListOfFlats);

router.get("/geListOfContacts",adminController.geListOfContacts);

router.post("/addListOfContacts", adminController.addEmergencyContact);

router.delete('/contacts/:pid',adminController.deleteEmergencyContact);

router.delete("/flat/:fid", adminController.deleteFlatById);


router.delete("/block/:bid", adminController.deleteBlockById);

router.post("/updatePassword", adminController.updateAdminPassword);

module.exports = router;