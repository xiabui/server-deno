import client from "../database/client.ts";
// config
import { TABLE } from "../database/config.ts";
// Interface
import { Caterogy }  from "../interfaces/category.ts";

export default {

  doesExistById: async (id: number) => {
    const [result] = await client.query(
      `SELECT COUNT(*) count FROM ${TABLE.caterogy} WHERE caterogy_id = ? LIMIT 1`,
      [id],
    );
    return result.count > 0;
  },

  getAll: async () => {
    return await client.execute(`SELECT * FROM ${TABLE.caterogy}`);
  },

  getById: async (id: number) => {
    return await client.query(
      `SELECT * FROM ${TABLE.caterogy} WHERE caterogy_id = ?`,
      [id],
    );
  },

  add: async ({
    caterogyName,
    caterogyDes,
  }: Caterogy) => {
      return await client.query(
        `INSERT INTO ${TABLE.caterogy}(caterogy_name, caterogy_description)
        values(?, ?)`,
        [caterogyName, caterogyDes],
      );
    },

  updateById: async ({
    caterogyID,
    caterogyName,
    caterogyDes,
  }: Caterogy) => {
    const result = await client.query(
      `UPDATE ${TABLE.caterogy} SET caterogy_name = ?, caterogy_description = ? WHERE caterogy_id = ?`,
      [
        caterogyName,
        caterogyDes,
        caterogyID
      ],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  deleteById: async (id: number) => {
    const result = await client.query(
      `DELETE FROM ${TABLE.caterogy} WHERE caterogy_id = ?`,
      [id],
    );
    // return count of rows updated
    return result.affectedRows;
  },
};