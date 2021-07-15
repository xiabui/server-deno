// interfaces
import { Context } from "https://deno.land/x/oak/mod.ts";
import secret_key from "../key.ts";
import VideoModel from "../models/video.ts";
import { format } from "https://deno.land/std@0.82.0/datetime/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
// models

export default {

    getAllVideo: async ({ response }: { response: any }) => {
        try {
            const data = await VideoModel.getAll();
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

    addVideo: async ({ request, response }: { request: any; response: any },) => {
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

            await VideoModel.add(
                {
                    videoTitle: valueItems['video_title'],
                    videoDesciption: valueItems['video_desciption'],
                    privacyId: valueItems['privacy_id'],
                    courseId: valueItems['course_id'],
                    videoURL: valueItems['video_url'],
                    courseIndex: valueItems['video_index']
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

    getVideoById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const isAvailable = await VideoModel.doesExistById(Number(params.id));
    
            if (!isAvailable) {
                response.status = 404;
                response.body = {
                    success: false,
                    message: "No video found",
                };
                return;
            }
    
            const data = await VideoModel.getById(Number(params.id));
            response.status = 200;
            response.body = {
                success: true,
                data: data,
            };
        } catch (error) {
                response.status = 400;
                response.body = {
                    success: false,
                    message: `Error: ${error}`,
                };
        }
    },

    updateVideoById: async  ({ params, request, response }: {
        params: { id: string };
        request: any;
        response: any;
        },) => {
        try {
            const isAvailable = await VideoModel.doesExistById(Number(params.id));
            if (!isAvailable) {
                response.status = 404;
                response.body = {
                    success: false,
                    message: "No video found",
                };
                return;
            }
        
            // if todo found then update todo
            const { value } = request.body({type: "json"});
            const valueItems = await value;

            const updatedRows = await VideoModel.updateById({
                videoId: Number(params.id),
                videoTitle: valueItems['video_title'],
                videoDesciption: valueItems['video_desciption'],
                privacyId: valueItems['privacy_id'],
                courseId: valueItems['course_id'],
                videoURL: valueItems['video_url'],
                courseIndex: valueItems['video_index']
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

    deleteVideoById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const updatedRows = await VideoModel.deleteById(Number(params.id));
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

    getVideoByCourseId: async (ctx: Context) => {

        if (!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "No data provided",
            };
            return;
        }

        const jwt = ctx.request.headers.get('Authorization') || '{}';
        const { value } = ctx.request.body({ type: "json" });
        const valueItems = await value;
        

        await verify(jwt, secret_key + valueItems['username'], "HS512").then(async () => {

            try {
                const data = await VideoModel.getVideoByCourseId(Number(valueItems['course_id'])); 

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

        }).catch(() => {

            ctx.response.status = 401;  
            ctx.response.body = {
                success: false,
                message: "Token is not provide or invalid.",
            };
            return;
        });
    },

    getDetailByVideoId: async (ctx: Context) => {
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
            const data = await VideoModel.getDetailByVideoId(Number(valueItems['video_id'])); 
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




};