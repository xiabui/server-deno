// interfaces
import { Context } from "https://deno.land/x/oak/mod.ts";
import { Privacy } from "../interfaces/privacy.ts";
import PrivacyModel from "../models/privacy.ts";
// models

export default {

    getAllPrivacy: async ({ response }: { response: any }) => {
        try {
            const data = await PrivacyModel.getAll();
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

    addPrivacy: async (ctx: Context) => {
        const { value } = ctx.request.body({ type: "json"});
        const valueItems = await value;

        if (!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "No data provided",
            };
            return;
        }

        try {

            await PrivacyModel.add(
                {
                    privacyName: valueItems['name'],
                    privacyDes: valueItems['description']
                },
            );

            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                message: "The record was added successfully",
            };

        } catch (error) {

            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: `Error: ${error}`,
            };

        }
    },

    getPrivacyById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const isAvailable = await PrivacyModel.doesExistById(Number(params.id));
    
            if (!isAvailable) {
                response.status = 404;
                response.body = {
                    success: false,
                    message: "No user found",
                };
                return;
            }
    
            const user = await PrivacyModel.getById(Number(params.id));
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

    updatePrivacyById: async  ({ params, request, response }: {
        params: { id: string };
        request: any;
        response: any;
        },) => {
        try {
            const isAvailable = await PrivacyModel.doesExistById(Number(params.id));
            if (!isAvailable) {
                response.status = 404;
                response.body = {
                    success: false,
                    message: "No user found",
                };
                return;
            }
        
            // if todo found then update todo
            const { value } = request.body({type: "json"});
            const valueItems = await value;

            const updatedRows = await PrivacyModel.updateById({
                privacyID: valueItems['id'],
                privacyName: valueItems['name'],
                privacyDes: valueItems['desciption']                
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

    deletePrivacyById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const updatedRows = await PrivacyModel.deleteById(Number(params.id));
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


};