const express = require("express");
const router = express.Router();
const hostelRoomController = require("../controllers/hostelRoomController");

router.get("/", hostelRoomController.getHostelRooms);
router.get("/:id", hostelRoomController.getHostelRoomById);
router.post("/", hostelRoomController.createHostelRoom);
router.put("/:id", hostelRoomController.updateHostelRoom);
router.delete("/:id", hostelRoomController.deleteHostelRoom);

module.exports = router;
