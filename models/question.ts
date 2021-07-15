import client from "../database/client.ts";
// config
import { TABLE } from "../database/config.ts";
// Interface
import { Question }  from "../interfaces/question.ts";

export default {

  doesExistById: async (id: number) => {
    const [result] = await client.query(
      `SELECT COUNT(*) count FROM ${TABLE.question} WHERE id = ? LIMIT 1`,
      [id],
    );
    return result.count > 0;
  },

  getAll: async () => {
    return await client.execute(`SELECT * FROM ${TABLE.question}`);
  },

  getById: async (id: number) => {
    return await client.query(
      `SELECT * FROM ${TABLE.question} WHERE id = ?`,
      [id],
    );
  },

  add: async ({
    courseId,
    exerciseId,
    questionTitle,
    questionContent,
    questionChoice,
    correctOption,
    multiChoice,
    questionGrade
  }: Question) => {
      return await client.query(
        `INSERT INTO ${TABLE.question} (course_id, exercise_id, question_title, question_content, question_choice, correct_option, multi_choice, question_grade)
        values(?, ?, ?, ?, ?, ?, ?, ?)`,
        [courseId, exerciseId, questionTitle, questionContent, questionChoice, correctOption, multiChoice, questionGrade],
      );
    },

  updateById: async ({
    id,
    courseId,
    exerciseId,
    questionTitle,
    questionContent,
    questionChoice,
    correctOption,
    multiChoice,
    questionGrade
  }: Question) => {
    const result = await client.query(
      `UPDATE ${TABLE.question}
        SET course_id = ?,
            exercise_id = ?,
            question_title = ?, 
            question_content = ?, 
            question_choice = ?, 
            correct_option = ?, 
            multi_choice = ?, 
            question_grade = ?
        WHERE id = ?`,
      [
        courseId,
        exerciseId,
        questionTitle,
        questionContent,
        questionChoice,
        correctOption,
        multiChoice,
        questionGrade,
        id
      ],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  deleteById: async (id: number) => {
    const result = await client.query(
      `DELETE FROM ${TABLE.question} WHERE id = ?`,
      [id],
    );
    // return count of rows updated
    return result.affectedRows;
  },

  getByExcerciseId: async(id: number) => {
    return await client.query(
        `SELECT * FROM ${TABLE.question} WHERE excercise_id = ?`,
        [id],
      );
  }
};