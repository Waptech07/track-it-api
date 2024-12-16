import { client } from "../connectDb.js";

export const getAllAccounts = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT u.id, u.name, u.email, u.country, u.role, u.registration_date AS "registrationDate",
        json_agg(
          json_build_object(
            'trackingCode', p.tracking_code,
            'status', p.status,
            'deliveryDate', p.delivery_date
          )
        ) AS packages
      FROM users u
      LEFT JOIN packages p ON u.id = p.user_id
      GROUP BY u.id;
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching accounts" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT u.id, u.name, u.email, u.country, u.registration_date AS "registrationDate",
        json_agg(
          json_build_object(
            'trackingCode', p.tracking_code,
            'status', p.status,
            'deliveryDate', p.delivery_date
          )
        ) AS packages
      FROM users u
      LEFT JOIN packages p ON u.id = p.user_id
      WHERE u.role = 'user'
      GROUP BY u.id;
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const updatePackageStatus = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { status, daysRemaining, message } = req.body;

    const updatedPackage = await client.query(
      `
      UPDATE packages
      SET status = $1, days_remaining = $2
      WHERE id = $3
      RETURNING *;
    `,
      [status, daysRemaining, packageId]
    );

    await client.query(
      `
      INSERT INTO messages (content, user_id, package_id)
      VALUES ($1, $2, $3);
    `,
      [message, req.user.id, packageId]
    );

    res.json(updatedPackage.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating package status" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await client.query(`DELETE FROM users WHERE id = $1;`, [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const updatedMessage = await client.query(
      `
      UPDATE messages
      SET content = $1
      WHERE id = $2
      RETURNING *;
    `,
      [content, messageId]
    );

    res.json({
      message: "Message updated successfully",
      updatedMessage: updatedMessage.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating message" });
  }
};
