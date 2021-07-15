import { Context } from "https://deno.land/x/oak/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.0/mod.ts";
import secret_key from "../key.ts";

const authMiddleware = async (ctx: Context, next: any) => {

    const headers: Headers = ctx.request.headers;
    const authorization = headers.get('Authorization');
    
    const { value } = ctx.request.body({ type: "json" });
    const valueItems = await value;

    

    if(!authorization){
        ctx.response.status = 401;
        console.log("[LOG] Server Authorization was not recieved data from [CLIENT].")
        return;
    }

    console.log("[LOG] Server Authorization was recieved data from client.")
    const jwt = authorization.split(' ')[1];
    if(!jwt) {
        ctx.response.status = 401;
        return;
    }

    if(await verify(jwt, secret_key + valueItems['username'], 'HS512')){
        await next();
        return;
    }
    
    ctx.response.status = 401;
    console.log("[LOG] Server Authorization: invalid token.")
    ctx.response.body = {message: 'Invalid token'};
};

export default authMiddleware;