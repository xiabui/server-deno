// interfaces
import { Context } from "https://deno.land/x/oak@v6.4.1/context.ts";
import { Caterogy } from "../interfaces/category.ts";
import CaterogyModel from "../models/category.ts";
// models

export default {

    getAllCaterogy: async ({ response }: { response: any }) => {
        try {
            const data = await CaterogyModel.getAll();
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

    addCategory: async ({ request, response }: { request: any; response: any },) => {
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

            await CaterogyModel.add(
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

    getCaterogyById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const isAvailable = await CaterogyModel.doesExistById(Number(params.id));
    
            if (!isAvailable) {
                response.status = 404;
                response.body = {
                    success: false,
                    message: "No user found",
                };
                return;
            }
    
            const user = await CaterogyModel.getById(Number(params.id));
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

    updateCaterogyById: async  ({ params, request, response }: {
        params: { id: string };
        request: any;
        response: any;
        },) => {
        try {
            const isAvailable = await CaterogyModel.doesExistById(Number(params.id));
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

            const updatedRows = await CaterogyModel.updateById({
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

    deleteCaterogyById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const updatedRows = await CaterogyModel.deleteById(Number(params.id));
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