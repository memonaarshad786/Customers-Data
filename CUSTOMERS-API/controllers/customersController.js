  // controllers/customersController.js
  const pool = require("../db");
  const { isEmailValid, checkRequiredFields } = require("../validators");

  // GET /customers (all, ?name=slug, or paginated)
async function getCustomers(req, res) {
  try {
    const nameSlug = req.query.name;

    // 🔍 1️⃣ If searching by name
    if (nameSlug) {
      const nameFromSlug = nameSlug.toLowerCase().replace(/-/g, " ");
      const [rows] = await pool.query(
        "SELECT * FROM customers WHERE LOWER(name) = ?",
        [nameFromSlug]
      );

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ error: { message: `Customer '${nameFromSlug}' not found`, code: 300 } });
      }

      return res.json(rows[0]);
    }

    const page = parseInt(req.query.page, 10) || 1; 
    const size = parseInt(req.query.size, 10) || parseInt(req.query.limit, 10) || 20; 
    const offset = (page - 1) * size;

    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM customers");

    const [rows] = await pool.query(
      "SELECT * FROM customers ORDER BY id ASC LIMIT ? OFFSET ?",
      [size, offset]
    );

    res.json({
      total,
      page,
      pages: Math.ceil(total / size),
      size,
      count: rows.length,
      customers: rows,
    });
  } catch (error) {
    console.error("getCustomers error:", error);
    res
      .status(500)
      .json({ error: { message: "Failed to retrieve customers", code: 500 } });
  }
}

// GET /customers/:id
async function getCustomerById(req, res) {
  try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: { message: "Invalid customer ID", code: 100 } }); // invalid input
      }

      const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: { message: "Customer not found", code: 300 } }); // not found
      }

      res.json(rows[0]);
    } catch (error) {
      console.error("getCustomerById error:", error);
      res.status(500).json({ error: { message: "Failed to retrieve customer", code: 500 } }); // server error
    }
  }

  // POST /customers
  async function createCustomer(req, res) {
    try {
      const payload = req.body || {};
      const required = ["name", "email", "phone", "address", "country"];
      const missing = checkRequiredFields(payload, required);

      if (missing.length) {
        return res.status(400).json({
          error: { message: "Missing required fields", fields: missing, code: 102 },
        });
      }

      if (!isEmailValid(payload.email)) {
        return res.status(400).json({ error: { message: "Invalid email format", code: 101 } });
      }

      // duplicate email check
      const [dup] = await pool.query("SELECT id FROM customers WHERE email = ?", [payload.email]);
      if (dup.length) {
        return res.status(409).json({ error: { message: "Email already exists", code: 200 } });
      }

      const { name, phone, email, address, country, region = null, postalZip = null, numberrange = null } = payload;

      const [result] = await pool.query(
        `INSERT INTO customers
        (name, phone, email, address, country, region, postalZip, numberrange, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [name, phone, email, address, country, region, postalZip, numberrange]
      );

      // ✅ only return ID
      res.status(201).json({ id: result.insertId });
    } catch (error) {
      console.error("createCustomer error:", error);
      res.status(500).json({ error: { message: "Failed to create customer", code: 500 } });
    }
  }

  // PUT /customers/:id
  async function updateCustomer(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: { message: "Invalid customer ID", code: 100 } });
      }

      const payload = req.body || {};
      const { name, phone, email, address, country, region, postalZip, numberrange } = payload;

      const [existing] = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);
      if (existing.length === 0) {
        return res.status(404).json({ error: { message: "Customer not found", code: 300 } });
      }

      if (email) {
        if (!isEmailValid(email)) {
          return res.status(400).json({ error: { message: "Invalid email format", code: 101 } });
        }
        const [dup] = await pool.query("SELECT id FROM customers WHERE email = ? AND id <> ?", [email, id]);
        if (dup.length) {
          return res.status(409).json({ error: { message: "Email already exists", code: 200 } });
        }
      }

      await pool.query(
        `UPDATE customers
        SET name = ?, phone = ?, email = ?, address = ?, country = ?, region = ?, postalZip = ?, numberrange = ?, updated_at = NOW()
        WHERE id = ?`,
        [
          name ?? existing[0].name,
          phone ?? existing[0].phone,
          email ?? existing[0].email,
          address ?? existing[0].address,
          country ?? existing[0].country,
          region ?? existing[0].region,
          postalZip ?? existing[0].postalZip,
          numberrange ?? existing[0].numberrange,
          id,
        ]
      );

      // ✅ 200 OK with empty body
      res.sendStatus(200);
    } catch (error) {
      console.error("updateCustomer error:", error);
      res.status(500).json({ error: { message: "Failed to update customer", code: 500 } });
    }
  }

  // DELETE /customers/:id
  async function deleteCustomer(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: { message: "Invalid customer ID", code: 100 } });
      }

      const [result] = await pool.query("DELETE FROM customers WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: { message: "Customer not found", code: 300 } });
      }

      // ✅ success delete
      res.status(200).json({ message: "Customer deleted successfully", deletedId: id });
    } catch (error) {
      console.error("deleteCustomer error:", error);
      res.status(500).json({ error: { message: "Failed to delete customer", code: 500 } });
    }
  }

  module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
