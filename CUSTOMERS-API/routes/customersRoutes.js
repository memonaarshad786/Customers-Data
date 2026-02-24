// routes/customersRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/customersController");

// GET /customers (all or ?name=)
router.get("/", controller.getCustomers);

// GET /customers/:id
router.get("/:id", controller.getCustomerById);

// POST /customers
router.post("/", controller.createCustomer);

// PUT /customers/:id
router.put("/:id", controller.updateCustomer);

// DELETE /customers/:id
router.delete("/:id", controller.deleteCustomer);

module.exports = router;
