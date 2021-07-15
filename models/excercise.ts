import client from "../database/client.ts";
// config
import { TABLE } from "../database/config.ts";
// Interface
import { Excercise }  from "../interfaces/excercise.ts";

export default {

  doesExistById: async (id: number) => {
    const [result] = await client.query(
      `SELECT COUNT(*) count FROM ${TABLE.excercise} WHERE exercise_id = ? LIMIT 1`,
      [id],
    );
    return result.count > 0;
  },

  getAll: async () => {
    return await client.execute(`SELECT * FROM ${TABLE.excercise}`);
  },

  getById: async (id: number) => {
    return await client.query(
      `SELECT * FROM ${TABLE.excercise} WHERE exercise_id = ?`,
      [id],
    );
  },

  add: async ({
    excerciseName,
    excerciseDesciption,
    excerciseCategory,
    excerciseURL,
    courseId,
    courseIndex,
    grade
  }: Excercise) => {
      return await client.query(
        `INSERT INTO ${TABLE.excercise} (exercise_name, exercise_description, exercise_category, exercise_url, course_id, course_index, grade)
        values(?, ?, ?, ?, ?, ?, ?)`,
        [excerciseName, excerciseDesciption, excerciseCategory, excerciseURL, courseId, courseIndex, grade],
      );
    },

  updateById: async ({
    excerciseId,
    excerciseName,
    excerciseDesciption,
    excerciseCategory,
    excerciseURL,
    courseId,
    courseIndex,
    grade
  }: Excercise) => {
    const result = await client.query(
      `UPDATE ${TABLE.question}
        SET 
           = ?,
          exercise_description = ?, 
          exercise_category = ?, 
          exercise_url = ?, 
          course_id = ?, 
          course_index = ?, 
          grade =?
        WHERE exercise_id = ?`,
      [
        excerciseName,
        excerciseDesciption,
        excerciseCategory,
        excerciseURL,
        courseId,
        courseIndex,
        grade,
        excerciseId
      ],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  deleteById: async (id: number) => {
    const result = await client.query(
      `DELETE FROM ${TABLE.excercise} WHERE exercise_id = ?`,
      [id],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  getByCourseId: async(id: number) => {
    return await client.query(
        `SELECT * FROM ${TABLE.excercise} WHERE exercise_id = ?`,
        [id],
      );
  },

  addToExcerciseResult: async (userid: number, exerciseid: number, marks: number, date: String) => {
    return await client.query(
      `INSERT INTO exercise_result VALUES (?, ?, ?, ?)`,
      [exerciseid, userid, marks, date]
    );
  },

  doesUserDoExercise: async (userid: number, exerciseid: number) => {
    const result = await client.query(
      `SELECT COUNT(*) count FROM exercise_result WHERE user_id = ? AND exercise_id = ?`,
      [userid, exerciseid]
    );

    return result.count > 0;
  },

  getMarks: async (userid: number, exerciseid: number) => {
    return await client.query(
      `SELECT * FROM exercise_result WHERE user_id = ? AND exercise_id = ?`,
      [userid, exerciseid]
    );
  }
};