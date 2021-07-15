import client from "../database/client.ts";
// config
import { TABLE } from "../database/config.ts";
// Interface
import { Course }  from "../interfaces/course.ts";

export default {

  doesExistById: async (id: number) => {
    const [result] = await client.query(
      `SELECT COUNT(*) count FROM ${TABLE.course} WHERE id = ? LIMIT 1`,
      [id],
    );
    return result.count > 0;
  },

  getAll: async () => {
    return await client.execute(
      `SELECT C.id, name, description, thumnail, teacher, concat(firstname, " ", lastname) as fullname, rating, C.category_id, category_name
        FROM COURSE C, USER U, CATEGORY CT
        WHERE C.teacher = U.id AND C.category_id = CT.category_id`);
  },

  getById: async (id: number) => {
    return await client.query(
      `SELECT * FROM ${TABLE.course} WHERE id = ?`,
      [id],
    );
  },

  add: async ({
    name,
    description,
    thumnail,
    teacher,
    caterogyID,
    price,
    dateCreate,
    privacyID,
  }: Course) => {
      return await client.query(
        `INSERT INTO ${TABLE.course}(name, description, thumnail, teacher, caterogy_id, rating, price, student_amount, date_create, privacy_id)
        values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, description, thumnail, teacher, caterogyID, 0.0, price, 0, dateCreate, privacyID],
      );
    },

  updateById: async ({
    id,
    name,
    description,
    thumnail,
    teacher,
    caterogyID,
    rating,
    price,
    numberOfStudent,
    dateCreate,
    privacyID,
  }: Course) => {
    const result = await client.query(
      `UPDATE ${TABLE.course} SET name = ?, description = ?, thumnail = ?, teacher = ?, caterogy_id= ?,
        rating = ?, price = ?, student_amount = ?, date_create = ?, privacy_id = ?
      WHERE id = ?`,
      [
        name,
        description,
        thumnail,
        teacher,
        caterogyID,
        rating,
        price,
        numberOfStudent,
        dateCreate,
        privacyID,
        id
      ],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  deleteById: async (id: number) => {
    const result = await client.query(
      `DELETE FROM ${TABLE.course} WHERE id = ?`,
      [id],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  getCoursesByCategoryId: async (caterogyId: number) => {
    return await client.execute(
      `SELECT C.id, name, description, thumnail, teacher, concat(firstname, " ", lastname) as fullname, rating, C.category_id, category_name
      FROM COURSE C, USER U, CATEGORY CT
      WHERE C.teacher = U.id AND C.category_id = CT.category_id AND C.category_id = ? LIMIT 0, 25`,
      [caterogyId]
    );
  },

  getCourseItemByCourseId: async (courseId: number) => {
    return await client.execute(
      `SELECT video_id as id, video_title as title, course_index, 'true' as is_video FROM video
      WHERE course_id = ?
      UNION ALL
      SELECT exercise_id as id, exercise_name as title, course_index, 'false' as is_video FROM exercise
      WHERE course_id = ? 
      ORDER BY course_index  ASC`,
      [courseId, courseId]
    );
  },

  getLastCourseAccess: async (userId: number) => {
    const result = await client.execute(
      `SELECT C.id, C.name, C.thumnail, concat(firstname, " ", lastname) as fullname
      FROM course_visited_history H, course C, user U
      WHERE H.course_id = C.id AND H.user_id = ? AND U.id = H.user_id`,
      [userId]
    );
    return result;
  },

  getCourseBySearch: async (keyword: string) => {
    const result = await client.execute(
      `SELECT C.id, C.name, U.firstname , U.lastname
      FROM course AS C, user AS U
      WHERE C.teacher = U.id AND (c.name LIKE '%${keyword}%' OR concat(u.firstname, u.lastname) LIKE '%${keyword}%') 
      `
    );
    console.log(result);
    return result;
  },

  userEnrollCourse: async (userid: number, course_id: number) => {
    return await client.query(
      `INSERT INTO course_enroll VALUES (?,?,?)`,
      [course_id, userid, false],
    );
  },

  isEnrollCourse: async (userid: number, course_id: number) => {
    const [result] = await client.query(
      `SELECT COUNT(*) count FROM course_enroll WHERE user_id = ? AND course_id = ?`,
      [userid, course_id]
    );

    return result.count > 0;
  } 
};