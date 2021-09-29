
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

router.delete("/officeBearer/:fid", adminController.deleteOfficeBearerById);

router.delete("/notice/:fid", adminController.deleteNoticerById);


router.delete("/block/:bid", adminController.deleteBlockById);

router.post("/updatePassword", adminController.updateAdminPassword);

router.post("/addOfficeBearer", adminController.addOfficeBearer);

router.post("/addNotice", adminController.addNotice);


router.get("/getListOfofficeBearer", adminController.geListOfOfficeBearer);

router.get("/getListOfNotices", adminController.geListOfNotices);

router.patch("/updateStatus/:id",adminController.updateFamilyMembersStatus);

module.exports = router;