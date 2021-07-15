import client from "../database/client.ts";
// config
import { TABLE } from "../database/config.ts";
// Interface
import { Privacy }  from "../interfaces/privacy.ts";

export default {

  doesExistById: async (id: number) => {
    const [result] = await client.query(
      `SELECT COUNT(*) count FROM ${TABLE.privacy} WHERE privacy = ? LIMIT 1`,
      [id],
    );
    return result.count > 0;
  },

  getAll: async () => {
    return await client.execute(`SELECT * FROM ${TABLE.privacy}`);
  },

  getById: async (id: number) => {
    return await client.query(
      `SELECT * FROM ${TABLE.caterogy} WHERE privacy_id = ?`,
      [id],
    );
  },

  add: async ({
    privacyName,
    privacyDes,
  }: Privacy) => {
      return await client.query(
        `INSERT INTO ${TABLE.privacy}(privacy_name, privacy_description)
        values(?, ?)`,
        [privacyName, privacyDes],
      );
    },

  updateById: async ({
    privacyID,
    privacyName,
    privacyDes,
  }: Privacy) => {
    const result = await client.query(
      `UPDATE ${TABLE.privacy} SET privacy_name = ?, privacy_description = ? WHERE privacy_id = ?`,
      [
        privacyName,
        privacyDes,
        privacyID
      ],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  deleteById: async (id: number) => {
    const result = await client.query(
      `DELETE FROM ${TABLE.privacy} WHERE caterogy_id = ?`,
      [id],
    );
    // return count of rows updated
    return result.affectedRows;
  },
};