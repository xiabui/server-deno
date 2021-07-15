// interfaces
import { User } from "../interfaces/user.ts";
import UserModel from "../models/user.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { create, getNumericDate  } from "https://deno.land/x/djwt@v2.0/mod.ts";
import secret_key from "../key.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
// models

export default {
    login: async (ctx: Context) => {
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
            const data = await UserModel.loginServer(valueItems['username']);

            if(data != null) {
                const row = data['rows']?.shift();
                const id = row['id'];
                const password = row['password'];
                
                if(await bcrypt.compare(valueItems['password'], password) == true) {

                    const key = secret_key + valueItems['username'];
                    const jwt = await create({ alg: "HS512", typ: "JWT" }, { exp: getNumericDate(60 * 600) }, key);

                    if(jwt){

                        ctx.response.status = 200;
                        ctx.response.body = {
                            userid: id,
                            username: valueItems['username'],
                            token: jwt
                        }

                    } else {

                        ctx.response.status = 500;
                        ctx.response.body = {
                            message: 'Internal server error'
                        }

                    }
                } else {
                    ctx.response.status = 400;
                    ctx.response.body = {
                        message: 'Wrong password.'
                    }

                }
            }
        } catch (error) {

            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: `Error: ${error}`,
            };

        }
    },

    verifyToken: async (ctx: Context) => {
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
        
        await verify(valueItems['token'], secret_key + valueItems['username'], "HS512").then(async () => {
            ctx.response.status = 200;
            ctx.response.body = {
                status: true,
                message: 'Valid token',
            }
        }).catch(() => {
            ctx.response.status = 400;  
            ctx.response.body = {
                success: false,
                message: "Token is not provide or invalid.",
            };
            return;
        });
    },

    getAllUsers: async ({ response }: { response: any }) => {
        try {
            const data = await UserModel.getAll();
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

    createUser: async ({ request, response }: { request: any; response: any },) => {
        const {body} = request.body({ type: "json"});
        const value = await body;

        if (!request.hasBody) {
            response.status = 400;
            response.body = {
                success: false,
                message: "No data provided",
            };
            return;
        }

        try {
            await UserModel.add(
                {
                    username: value['username'],
                    firstname: value['firstname'],
                    lastname: value['lastname'],
                    password: value['password'],
                    email: value['email'], 
                    dateOfBirth: value['dateOfBirth'], 
                    imageUrl: value['imageUrl'], 
                    roleID: value['roleID'], 
                    address: value['address'], 
                    province: value['province'] , 
                    city: value['city'], 
                    ward: value['ward'], 
                    country: value['country'], 
                    postcode: value['postcode'], 
                    verified: value['verified'],
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

    getUserByUsername: async (ctx: Context) => {
        
        if (!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "No data provided",
            };
            return;
        }

        const { value } = ctx.request.body({ type: "json"});
        const valueItems = await value;

        try {   
            const user = await UserModel.getByUsername(valueItems['username']);
            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                data: user,
            };
        } catch (error) {
                ctx.response.status = 400;
                ctx.response.body = {
                    success: false,
                    message: `Error: ${error}`,
                };
        }
    },

    updateUserById: async ({ params, request, response }: {
        params: { id: string };
        request: any;
        response: any;
        },
    ) => {
        try {
            const isAvailable = await UserModel.doesExistById(Number(params.id));
            if (!isAvailable) {
                response.status = 404;
                response.body = {
                    success: false,
                    message: "No user found",
                };
                return;
            }
        
            // if todo found then update todo
            const { body } = request.body({type: "json"});
            const value = await body;

            const updatedRows = await UserModel.updateById({
                id: Number(params.id),
                username: value['username'],
                firstname: value['firstname'],
                lastname: value['lastname'],
                password: value['password'], 
                email: value['email'], 
                dateOfBirth: value['dateOfBirth'], 
                imageUrl: value['imageUrl'], 
                roleID: value['roleID'], 
                address: value['address'], 
                province: value['province'] , 
                city: value['city'], 
                ward: value['ward'], 
                country: value['country'], 
                postcode: value['postcode'], 
                verified: value['verified'],
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

    deleteUserById: async ({ params, response }: { params: { id: string }; response: any },) => {
        try {
            const updatedRows = await UserModel.deleteById(Number(params.id));
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

    registerAccount: async (ctx: Context) => {
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

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(valueItems['password'], salt);

            await UserModel.registerAccount(
                valueItems['username'],
                valueItems['lastname'],
                valueItems['firstname'],
                valueItems['email'],
                passwordHash,
                valueItems['dateOfBirth']
            );

            ctx.response.status = 200,
            ctx.response.body = {
                success: true,
                message: "Register successfully"
            }

        } catch(error) {
            ctx.response.status = 400,
            ctx.response.body = {
                success: false,
                message: `Error ${error}`
            }
        }
    },

    getTokenForForgotenPasswordUser: async (ctx: Context) => {

        if(!ctx.request.hasBody) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "No data provided",
            }
            return;
        }

        //Get data and check the email valid
        const { value } = ctx.request.body({ type: "json" });
        const valueItems = await value;
        try {
            const isAvailable = await UserModel.doesExistByEmail(valueItems['email']);

            //If it isn't available, server will response and return
            if(!isAvailable){
                ctx.response.status == 404;
                ctx.response.body = {
                    success: false,
                    message: "The email is invalid or unused."
                }
                return;
            }

            const key = secret_key;
            const jwt = await create({ alg: "HS512", typ: "JWT" }, { exp: getNumericDate(60 * 600) }, key);
            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                token: jwt
            }
        } catch(error){
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: `Error: ${error}`
            }
        }

    },

    resetPassword: async (ctx:Context) => {

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
                
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(valueItems['password'], salt);
            //Calling reset password functional
            await UserModel.resetPassword(valueItems['username'], passwordHash);
            
            ctx.response.status = 200;
            ctx.response.body = {
                'status': true,
                'message': 'Updated user\'s password.',
            }

        } catch(error) {
            ctx.response.status = 400,
            ctx.response.body = {
                success: false,
                message: `Error ${error}`
            }

        }
    },

    getUserFullname: async (ctx:Context) => {

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
            //Calling reset password functional
            const data = await UserModel.getUserFullname(Number.parseInt(valueItems['userid']));
            
            ctx.response.status = 200;
            ctx.response.body = {
                'status': true,
                'data': data
            }

        } catch(error) {
            ctx.response.status = 400,
            ctx.response.body = {
                success: false,
                message: `Error ${error}`
            }

        }
    }
};