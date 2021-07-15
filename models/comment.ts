import client from "../database/client.ts";
// config
import { TABLE } from "../database/config.ts";
// Interface
import { Comment }  from "../interfaces/comment.ts";

export default {

  doesExistById: async (id: number) => {
    const [result] = await client.query(
      `SELECT COUNT(*) count FROM ${TABLE.comment} WHERE comment_id = ? LIMIT 1`,
      [id],
    );
    return result.count > 0;
  },

  getAll: async () => {
    return await client.execute(`SELECT * FROM ${TABLE.comment}`);
  },

  getById: async (id: number) => {
    return await client.query(
      `SELECT * FROM ${TABLE.comment} WHERE comment_id = ?`,
      [id],
    );
  },

  addComment: async ({
    userId,
    content,
    date,
    courseId,
    itemId,
    isVideo
  }: Comment) => {
      return await client.query(
        `INSERT INTO ${TABLE.comment}(userid, content, date, course_id, item_id, is_video)
        values(?, ?, ?, ?, ?, ?)`,
        [userId, content, date, courseId, itemId, isVideo],
      );
    },

  updateById: async ({
    commentId,
    userId,
    content,
    date,
    courseId,
    itemId,
    isVideo
  }: Comment) => {
    const result = await client.query(
      `UPDATE ${TABLE.comment} SET userid = ?, content = ?, date = ?, course_id = ?, item_id = ?, is_video = ?
      WHERE comment_id = ?`,
      [
        userId,
        content,
        date,
        courseId,
        itemId,
        isVideo,
        commentId
      ],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  deleteById: async (id: number) => {
    const result = await client.query(
      `DELETE FROM ${TABLE.comment} WHERE comment_id = ?`,
      [id],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  getCommentByItemId: async ({itemId, isVideo}: Comment) => {
    const result = await client.execute(
      `SELECT comment_id, content, date, username, concat(firstname, " ", lastname) as fullname, imageUrl, liked
      FROM ${TABLE.comment} as C, user as U
      WHERE item_id = ? AND is_video = ? AND U.id = C.userid
      ORDER BY date DESC
      `,
      [itemId, isVideo]
    );
    
    return result;
  },

  getCommentByUser: async (userid: number) => {
    const result = await client.execute(
      `SELECT * FROM ${TABLE.comment} WHERE userid = ?`,
      [userid]
    );
    return result;
  },

  updateCommentByUser: async ({commentId, content, date}: Comment) => {
    const result = await client.execute(
        `UPDATE ${TABLE.comment} SET content = ?, date = ? WHERE comment_id = ?`,
        [content, date, commentId]
    );
    console.log("[MYSQL] Updating...");
    return result.affectedRows;
  },

  isLiked: async (userid: number, comment_id: number) => {
    const [result] = await  await client.query(
      `SELECT COUNT(*) count FROM like_history WHERE comment_id = ? and user_id = ? LIMIT 1`,
      [comment_id, userid]
    );

    console.log("[MYSQL] Checking...");

    return result.count > 0;
  },

  addHistory: async (userid: number, id: number) => {
    console.log("[MYSQL] Inserting...");
    return await client.query(
      `INSERT INTO like_history VALUES (?,?)`,
      [userid, id]
    );
  },

  addLike: async (userid: number, id: number) => {
    const result = await client.execute(
      `UPDATE ${TABLE.comment} SET liked = liked + 1
      WHERE comment_id = ?`,
      [id],
    );

    console.log("[MYSQL] Updating...");
    
    return result.affectedRows; 
  }
};