import { client } from "../connectDb.js";

export const getPackages = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT p.id, p.tracking_code AS "trackingCode", p.status, p.delivery_date AS "deliveryDate", 
        p.days_remaining AS "daysRemaining", 
        json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email
        ) AS user
      FROM packages p
      LEFT JOIN users u ON p.user_id = u.id;
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching packages" });
  }
};

export const createPackage = async (req, res) => {
  try {
    const { trackingCode, status, deliveryDate, userId } = req.body;

    if (!trackingCode || !status || !deliveryDate || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await client.query(
      `
      INSERT INTO packages (tracking_code, status, delivery_date, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
      [trackingCode, status, deliveryDate, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating package" });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { trackingCode, status, deliveryDate, daysRemaining } = req.body;

    const result = await client.query(
      `
      UPDATE packages
      SET tracking_code = $1, status = $2, delivery_date = $3, days_remaining = $4
      WHERE id = $5
      RETURNING *;
    `,
      [trackingCode, status, deliveryDate, daysRemaining, packageId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating package" });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const { packageId } = req.params;

    const result = await client.query(
      `
      DELETE FROM packages
      WHERE id = $1
      RETURNING *;
    `,
      [packageId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting package" });
  }
};

export const getPackageDetails = async (req, res) => {
  try {
    const { packageId } = req.params;

    const result = await client.query(
      `
      SELECT p.id, p.tracking_code AS "trackingCode", p.status, p.delivery_date AS "deliveryDate", 
        p.days_remaining AS "daysRemaining",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email
        ) AS user
      FROM packages p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = $1;
    `,
      [packageId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching package details" });
  }
};
