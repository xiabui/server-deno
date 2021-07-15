// interfaces
import { Question } from "../interfaces/question.ts";
import QuestionModel from "../models/question.ts";
import secret_key from "../key.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
// models

export default {

    getAllQuestion: async ({ response }: { response: any }) => {
        try {
            const data = await QuestionModel.getAll();
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

    addQuestion: async ({ request, response }: { request: any; response: any },) => {
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

            await QuestionModel.add(
                {
                    caterogyName: valueItems['name'],
                    caterogyDes: valueItems['description']
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

    getQuestionById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const isAvailable = await QuestionModel.doesExistById(Number(params.id));
    
            if (!isAvailable) {
                response.status = 404;
                response.body = {
                    success: false,
                    message: "No user found",
                };
                return;
            }
    
            const user = await QuestionModel.getById(Number(params.id));
            response.status = 200;
            response.body = {
                success: true,
                data: user,
            };
        } catch (error) {
                response.status = 400;
                response.body = {
                    success: false,
                    message: `Error: ${error}`,
                };
        }
    },

    updateQuestionById: async  ({ params, request, response }: {
        params: { id: string };
        request: any;
        response: any;
        },) => {
        try {
            const isAvailable = await QuestionModel.doesExistById(Number(params.id));
            if (!isAvailable) {
                response.status = 404;
                response.body = {
                    success: false,
                    message: "No question found",
                };
                return;
            }
        
            // if todo found then update todo
            const { value } = request.body({type: "json"});
            const valueItems = await value;

            const updatedRows = await QuestionModel.updateById({
                caterogyID: valueItems['id'],
                caterogyName: valueItems['name'],
                caterogyDes: valueItems['desciption']                
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

    deleteQuestionById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const updatedRows = await QuestionModel.deleteById(Number(params.id));
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

    getByExcerciseId: async (ctx: Context) => {
        if (!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "No data provided",
            };
            return;
        }

        const { value } = ctx.request.body({ type: "json" });
        const valueItems = await value;

        try {
            

            const data = await QuestionModel.getByExcerciseId(Number(valueItems['excercise_id']));
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


};