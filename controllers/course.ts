// interfaces
import { Context } from "https://deno.land/x/oak/mod.ts";
import secret_key from "../key.ts";
import CourseModel from "../models/course.ts";
import { format } from "https://deno.land/std@0.82.0/datetime/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
// models

export default {

    getAllCourses: async ({ response }: { response: any }) => {
        try {
            const data = await CourseModel.getAll();
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

    addCourse: async ({ request, response }: { request: any; response: any },) => {
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

            await CourseModel.add(
                {
                    name: valueItems['name'],
                    description: valueItems['description'],
                    thumnail: valueItems['thumnail'],
                    teacher: valueItems['teacher'],
                    caterogyID: valueItems['caterogy'],
                    price: valueItems['price'],
                    dateCreate: format(valueItems['dateCreate'], "yyyy-MM-dd"),
                    privacyID: valueItems['privacyID'],
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

    getCourseById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const isAvailable = await CourseModel.doesExistById(Number(params.id));
    
            if (!isAvailable) {
                response.status = 404;
                response.body = {
                    success: false,
                    message: "No course found",
                };
                return;
            }
    
            const user = await CourseModel.getById(Number(params.id));
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

    updateCourseById: async  ({ params, request, response }: {
        params: { id: string };
        request: any;
        response: any;
        },) => {
        try {
            const isAvailable = await CourseModel.doesExistById(Number(params.id));
            if (!isAvailable) {
                response.status = 404;
                response.body = {
                    success: false,
                    message: "No course found",
                };
                return;
            }
        
            // if todo found then update todo
            const { value } = request.body({type: "json"});
            const valueItems = await value;

            const updatedRows = await CourseModel.updateById({
                id: Number(params.id),
                name: valueItems['name'],
                description: valueItems['description'],
                thumnail: valueItems['thumnail'],
                teacher: valueItems['teacher'],
                caterogyID: valueItems['caterogy'],
                price: valueItems['price'],
                dateCreate: format(valueItems['dateCreate'], "yyyy-MM-dd"),
                privacyID: valueItems['privacyID'],
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

    deleteCourseById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const updatedRows = await CourseModel.deleteById(Number(params.id));
            response.status = 200;
            response.body = {
                success: true,
                message: `Successfully deleted ${updatedRows} row(s)`,
            };
        } catch (error) {
            response.status = 400;
            response.body = {
            success: false,
            message: `Error: ${error}`,
            };
        }
    },

    getCoursesByCategoryId:  async (ctx: Context) => {
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
            
            const data = await CourseModel.getCoursesByCategoryId(Number(valueItems['category_id']));
            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                data: data['rows'],
            };
        } catch (error) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: `Error: ${error}`,
            };
        }
    },

    getCourseItemByCourseId: async (ctx: Context) => {

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
            const data = await CourseModel.getCourseItemByCourseId(Number(valueItems['course_id'])); 

            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                data: data['rows']
            };
        } catch(error) {
            ctx.response.status = 401;
            ctx.response.body = {
                success: false,
                message: error
            }
        }
        
    },

    getLastCourseAccess: async (ctx: Context) => {

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
            const data = await CourseModel.getLastCourseAccess(Number(valueItems['userId'])); 

            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                data: data['rows']
            };
        } catch(error) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: `${error}`
            }
        };
        
    },

    getCourseBySearch: async (ctx: Context) => {

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
            const data = await CourseModel.getCourseBySearch(valueItems['keyword']); 

            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                data: data['rows']
            };
        } catch(error) {
            ctx.response.status = 401;
            ctx.response.body = {
                success: false,
                message: `${error}`
            }
        }
    },

    isEnroll: async (ctx: Context) => {
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
            const data = await CourseModel.isEnrollCourse(valueItems['user_id'], valueItems['course_id']); 
            if(!data) {
               ctx.response.status = 404; 
            } else {
                ctx.response.status = 200;
                ctx.response.body = {
                    success: true
                };
            }
        } catch(error) {
            ctx.response.status = 401;
            ctx.response.body = {
                success: false,
                message: error
            }
        }
    },

    enrollToCourse: async (ctx: Context) => {
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
            const data = await CourseModel.isEnrollCourse(valueItems['user_id'], valueItems['course_id']); 
            if(!data) {
                await CourseModel.userEnrollCourse(valueItems['user_id'], valueItems['course_id']); 
                ctx.response.status = 200;
                ctx.response.body = {
                    success: true
                }; 
            } else {
                ctx.response.status = 201;
                ctx.response.body = {
                    success: 'duplicate'
                };
            }
        } catch(error) {
            ctx.response.status = 401;
            ctx.response.body = {
                success: false,
                message: error
            }
        }
    }


};