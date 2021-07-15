// interfaces
import { Question } from "../interfaces/question.ts";
import ExcerciseModel from "../models/excercise.ts";
import secret_key from "../key.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
// models

export default {

    getAll: async ({ response }: { response: any }) => {
        try {
            const data = await ExcerciseModel.getAll();
            response.status = 200;
            response.body = {
                success: true,
                data: data['rows'],
            };
        } catch (error) {
            response.status = 400;
            response.body = {
            success: false,
            message: `Error: ${error}`,
            };
        }
    },

    addNew: async ({ request, response }: { request: any; response: any },) => {
        const { value } = request.body({ type: "json"});
        const valueItems = await value;

        if (!request.hasBody) {
            response.status = 400;
            response.body = {
                success: false,
                message: "No data provided",
            };
            return;
        }

        try {

            await ExcerciseModel.add(
                {
                    excerciseName: valueItems['excercise_name'],
                    excerciseDesciption: valueItems['excercise_description'],
                    excerciseCategory: valueItems['excercise_category'],
                    excerciseURL: valueItems['excercise_url'],
                    courseId: valueItems['course_id'],
                    courseIndex: valueItems['course_index'],
                    grade: valueItems['grade']
                },
            );

            response.status = 200;
            response.body = {
                success: true,
                message: "The record was added successfully",
            };

        } catch (error) {

            response.status = 400;
            response.body = {
                success: false,
                message: `Error: ${error}`,
            };

        }
    },

    getById: async (ctx: Context) => {
        if (!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "No data provided",
            };
            return;
        }
        
        try {
            const { value } = ctx.request.body({ type: "json" });
            const valueItems = await value;

            
            const data = await ExcerciseModel.getById(Number(valueItems['id']));
            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                data: data,
            };
        } catch (error) {
            ctx.response.status = 400;  
            ctx.response.body = {
                success: false,
                message: `${error}`,
            };
            return;
        }
    },

    updateById: async  ({ params, request, response }: {
        params: { id: string };
        request: any;
        response: any;
        },) => {
        try {
            const isAvailable = await ExcerciseModel.doesExistById(Number(params.id));
            if (!isAvailable) {
                response.status = 404;
                response.body = {
                    success: false,
                    message: "No item found",
                };
                return;
            }
        
            // if todo found then update todo
            const { value } = request.body({type: "json"});
            const valueItems = await value;

            const updatedRows = await ExcerciseModel.updateById({
                excerciseId: Number.parseInt(valueItems['excercise_id']),
                excerciseName: valueItems['excercise_name'],
                excerciseDesciption: valueItems['excercise_description'],
                excerciseCategory: valueItems['excercise_category'],
                excerciseURL: valueItems['excercise_url'],
                courseId: Number.parseInt(valueItems['course_id']),
                courseIndex: valueItems['course_index'],
                grade: valueItems['grade']                
            });

            response.status = 200;
            response.body = {
                success: true,
                message: `Successfully updated ${updatedRows} row(s)`,
            };

        } catch (error) {
            response.status = 400;
            response.body = {
                success: false,
                message: `Error: ${error}`,
            };
        }
    },

    deleteById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const updatedRows = await ExcerciseModel.deleteById(Number(params.id));
            response.status = 200;
            response.body = {
                success: true,
                message: `Successfully updated ${updatedRows} row(s)`,
            };
        } catch (error) {
            response.status = 400;
            response.body = {
            success: false,
            message: `Error: ${error}`,
            };
        }
    },

    getByCourseId: async (ctx: Context) => {
        if (!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "No data provided",
            };
            return;
        }

        try {
            const { value } = ctx.request.body({ type: "json" });
            const valueItems = await value;
            
            const data = await ExcerciseModel.getByCourseId(Number(valueItems['course_id']));
                ctx.response.status = 200;
                ctx.response.body = {
                    success: true,
                    data: data,
                };
        } catch (error) {
            ctx.response.status = 400;  
            ctx.response.body = {
                success: false,
                message: `${error}`,
            };
            return;
        }
    },

    addToExcerciseResult: async (ctx: Context) => {
        if (!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "No data provided",
            };
            return;
        }

        try {
            const { value } = ctx.request.body({ type: "json" });
            const valueItems = await value;
            
            await ExcerciseModel.addToExcerciseResult(
                Number(valueItems['user_id']),
                Number(valueItems['exercise_id']),
                Number(valueItems['marks']),
                valueItems['date']
            );
            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                data: "successfully",
            };
        } catch (error) {
            ctx.response.status = 400;  
            ctx.response.body = {
                success: false,
                message: `${error}`,
            };
            return;
        }
    },

    doesUserDoExercise: async (ctx: Context) => {
        if (!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "No data provided",
            };
            return;
        }

        try {
            const { value } = ctx.request.body({ type: "json" });
            const valueItems = await value;
            
            const result = await ExcerciseModel.doesUserDoExercise(
                Number(valueItems['user_id']),
                Number(valueItems['exercise_id']),
            );
            if(!result) {
                ctx.response.status = 400;
            } else {
                ctx.response.status = 200;
                ctx.response.body = {
                    success: true,
                    data: "successfully",
                };
            }
            
        } catch (error) {
            ctx.response.status = 400;  
            ctx.response.body = {
                success: false,
                message: `${error}`,
            };
            return;
        }
    },

    getMarks: async (ctx: Context) => {
        if (!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "No data provided",
            };
            return;
        }

        try {
            const { value } = ctx.request.body({ type: "json" });
            const valueItems = await value;
            
            const result = await ExcerciseModel.getMarks(
                Number(valueItems['user_id']),
                Number(valueItems['exercise_id']),
            );
            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                data: result,
            };
        } catch (error) {
            ctx.response.status = 400;  
            ctx.response.body = {
                success: false,
                message: `${error}`,
            };
            return;
        }
    }


};