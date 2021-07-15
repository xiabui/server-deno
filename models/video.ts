import client from "../database/client.ts";
// config
import { TABLE } from "../database/config.ts";
// Interface
import { Video }  from "../interfaces/video.ts";

export default {

  doesExistById: async (id: number) => {
    const [result] = await client.query(
      `SELECT COUNT(*) count FROM ${TABLE.video} WHERE video_id = ? LIMIT 1`,
      [id],
    );
    return result.count > 0;
  },

  getAll: async () => {
    return await client.execute(`SELECT * FROM ${TABLE.video}`);
  },

  getById: async (id: number) => {
    return await client.query(
      `SELECT * FROM ${TABLE.video} WHERE video_id = ?`,
      [id],
    );
  },

  add: async ({
    videoTitle,
    videoDesciption,
    privacyId,
    courseId,
    videoURL,
    courseIndex,
  }: Video) => {
      return await client.query(
        `INSERT INTO ${TABLE.course}(video_title, video_desciption, privacy_id, course_id, video_url, course_index)
        VALUES(?, ?, ?, ?, ?, ?)`,
        [videoTitle, videoDesciption, privacyId, courseId, videoURL, courseIndex],
      );
    },

  updateById: async ({
    videoId,
    videoTitle,
    videoDesciption,
    privacyId,
    courseId,
    videoURL,
    courseIndex,
  }: Video) => {
    const result = await client.query(
      `UPDATE ${TABLE.video} SET video_title = ?, video_desciption = ?, privacy_id = ?, course_id = ?, video_url = ?, course_index = ?
      WHERE video_id = ?`,
      [
        videoTitle,
        videoDesciption,
        privacyId,
        courseId,
        videoURL,
        courseIndex,
        videoId
      ],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  deleteById: async (id: number) => {
    const result = await client.query(
      `DELETE FROM ${TABLE.video} WHERE video_id = ?`,
      [id],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  getVideoByCourseId: async (id: number) => {
    const result = await client.execute(
      `SELECT video_id, video_title FROM ${TABLE.video} WHERE course_id = ?`,
      [id]
    );
    
    return result;
  },

  getDetailByVideoId: async (id: number) => {
    const result = await client.execute(
      `SELECT * FROM ${TABLE.video} WHERE video_id = ?`,
      [id]
    );
    
    return result;
  },
};