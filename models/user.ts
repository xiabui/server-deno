import client from "../database/client.ts";
// config
import { TABLE } from "../database/config.ts";
// Interface
import { User }  from "../interfaces/user.ts";

export default {

  doesExistById: async (id: number) => {
    const [result] = await client.query(
      `SELECT COUNT(*) count FROM ${TABLE.user} WHERE id = ? LIMIT 1`,
      [id],
    );
    return result.count > 0;
  },

  doesExistByEmail: async (email: string) => {
    const [result] = await client.query(
      `SELECT COUNT(*) count FROM ${TABLE.user} WHERE email = ? LIMIT 1`,
      [email],
    );
    return result.count > 0;
  },

  getAll: async () => {
    return await client.execute(`SELECT * FROM ${TABLE.user}`);
  },

  getByUsername: async (username: string) => {
    return await client.query(
      `SELECT * FROM ${TABLE.user} WHERE username = ?`,
      [username],
    );
  },

  add: async ({
    username, 
    firstname, 
    lastname, 
    password,
    email,
    dateOfBirth, 
    imageUrl, 
    roleID, 
    address, 
    province, 
    city, 
    ward, 
    country, 
    postcode, 
    verified
  }: User) => {
      return await client.query(
        `INSERT INTO ${TABLE.user}(username, firstname, lastname, password, email, dateOfBirth, imageUrl, roleID, address, province,  city, ward, country, postcode, verified)
        values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          username, 
          firstname, 
          lastname, 
          password, 
          email,
          dateOfBirth, 
          imageUrl, 
          roleID, 
          address, 
          province, 
          city, 
          ward, 
          country, 
          postcode, 
          verified
        ],
      );
    },

  updateById: async ({
    id,
    username, 
    firstname, 
    lastname, 
    password,
    email, 
    dateOfBirth, 
    imageUrl, 
    roleID, 
    address, 
    province, 
    city, 
    ward, 
    country, 
    postcode, 
    verified
  }: User) => {
    const result = await client.query(
      `UPDATE ${TABLE.user} SET username = ?, 
        firstname = ?, 
        lastname = ?, 
        password = ?, 
        email = ?,
        dateOfBirth = ?, 
        imageUrl = ?, 
        roleID = ?, 
        address = ?, 
        province = ?, 
        city = ?, 
        ward = ?, 
        country = ?, 
        postcode = ?, 
        verified = ? WHERE id = ?`,
      [
        username, 
        firstname, 
        lastname, 
        password, 
        email,
        dateOfBirth, 
        imageUrl, 
        roleID, 
        address, 
        province, 
        city, 
        ward, 
        country, 
        postcode, 
        verified,
        id
      ],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  deleteById: async (id: number) => {
    const result = await client.query(
      `DELETE FROM ${TABLE.user} WHERE id = ?`,
      [id],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  loginServer: async (username: string) => {
    // return count of rows updated
    return await client.execute(
      `SELECT * FROM ${TABLE.user} WHERE username = ?`,
      [username],
    );
  },

  registerAccount: async (username: string, lastname: string, firstname: string,
                          email: string, password: string, dateOfBirth: string) =>
  {
    return await client.query(
      `INSERT INTO ${TABLE.user}(username, firstname, lastname, password, email, dateOfBirth, imageUrl, roleID)
      values(?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username, 
        firstname, 
        lastname, 
        password, 
        email,
        dateOfBirth,
        'avatar.png',
        2
      ],
    );
  },

  resetPassword: async (username: string, password: string) => {
    console.log(username);
    return await client.query(`UPDATE ${TABLE.user} SET password = ? WHERE username = ?`, [password, username]);
  },

  getUserFullname: async (userid: number) => {
    return await client.query(`SELECT firstname + ' ' + lastname as fullname FROM ${TABLE.user} WHERE userid = ?`, [userid]);
  },
  
};