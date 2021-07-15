// interfaces
import { Context } from "https://deno.land/x/oak/mod.ts";
import secret_key from "../key.ts";
import CommentModel from "../models/comment.ts";
import { format } from "https://deno.land/std@0.82.0/datetime/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
// models

export default {

    getAllComments: async ({ response }: { response: any }) => {
        try {
            const data = await CommentModel.getAll();
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

    addComment: async (ctx: Context) => {

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
            await CommentModel.addComment({
                userId: valueItems['userid'],
                content: valueItems['content'],
                date: valueItems['date'],
                courseId: valueItems['course_id'],
                itemId: valueItems['item_id'],
                isVideo: valueItems['is_video']
            }); 

            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                message: "Add comment successfully"
            };

        } catch(error) {
            ctx.response.status = 401;
            ctx.response.body = {
                success: false,
                message: `${error}`
            }
        }
        
    },

    getCommentById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const isAvailable = await CommentModel.doesExistById(Number(params.id));
    
            if (!isAvailable) {
                response.status = 404;
                response.body = {
                    success: false,
                    message: "No course found",
                };
                return;
            }
    
            const user = await CommentModel.getById(Number(params.id));
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

    updateCommentById: async  ({ params, request, response }: {
        params: { id: string };
        request: any;
        response: any;
        },) => {
        try {
            const isAvailable = await CommentModel.doesExistById(Number(params.id));
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

            const updatedRows = await CommentModel.updateById({
                commentId: Number(params.id),
                userId: valueItems['userid'],
                content: valueItems['content'],
                date: format(valueItems['date'], "yyyy-MM-dd"),
                courseId: valueItems['course_id'],
                itemId: valueItems['item_id'],
                isVideo: valueItems['is_video']
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

    deleteCommentById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const updatedRows = await CommentModel.deleteById(Number(params.id));
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

    getCommentByItemId: async (ctx: Context) => {
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
            const result = await CommentModel.getCommentByItemId({
                itemId: valueItems['item_id'],
                isVideo: valueItems['is_video']
            }); 

            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                data: result['rows']
            };

        } catch(error) {
            ctx.response.status = 401;
            ctx.response.body = {
                success: false,
                message: error
            }
        }
    },
    
    getCommentByUser: async (ctx: Context) => {
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
            const result = await CommentModel.getCommentByUser(valueItems['userid']); 

            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                data: result['rows']
            };

        } catch(error) {
            ctx.response.status = 401;
            ctx.response.body = {
                success: false,
                message: error
            }
        }
    },
    
    updateCommentByUser: async (ctx: Context) => {
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
            const result = await CommentModel.updateCommentByUser({
                content: valueItems['content'],
                date: format(valueItems['date'], "yyyy-MM-dd"),
                commentId: valueItems['comment_id']
            }); 

            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                data: "updated"
            };

        } catch(error) {
            ctx.response.status = 401;
            ctx.response.body = {
                success: false,
                message: error
            }
        }
    },

    isLiked: async (ctx: Context) => {
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
            const isAvailable = await CommentModel.isLiked(valueItems['userid'], valueItems['id']);
            if(isAvailable){
                ctx.response.status = 200;
                ctx.response.body = {
                    success: true,
                };
            } else {
                ctx.response.status = 500;
            }
        } catch(error) {
            ctx.response.status = 401;
            ctx.response.body = {
                success: false,
                message: error
            }
        }
    },

    addLike: async(ctx: Context) => {
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
            const isAvailable = await CommentModel.isLiked(valueItems['userid'], valueItems['id']);
            if(!isAvailable){
                const result1 = await CommentModel.addLike(valueItems['userid'], valueItems['id']); 
                await CommentModel.addHistory(valueItems['userid'], valueItems['id']);
                ctx.response.status = 200;
                ctx.response.body = {
                    success: true,
                    data: "updated"
                };
            } else {
                ctx.response.status = 500;
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