import express from 'express'
const router =express.Router();

import DeliveryController from '../controllers/DeliveryControllers.js';
import e from 'express';

router.get("/",DeliveryController.getAllDelivery);
router.post("/",DeliveryController.addDeliverys);
router.get("/:id",DeliveryController.getById);
router.put("/:id",DeliveryController.updateDelivery);
router.delete("/:id",DeliveryController.deleteDelivery );

router.post("/:id/resend-email", DeliveryController.resendConfirmationEmail);

export default router;