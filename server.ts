import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import authMiddleware from "./middlewares/authMiddleware.ts";
import userRouter from './routers/user.ts';
import courseRouter from './routers/course.ts';
import cateroryRouter from './routers/category.ts';
import videoRouter from './routers/video.ts';
import privacyRouter from './routers/privacy.ts';
import commentRouter from './routers/comment.ts';
import questionRouter from './routers/question.ts'
import excerciseRouter from './routers/excercise.ts';
import assetsRouter from './routers/assets.ts';
import notFound from './middlewares/notFound.ts';

const app = new Application();


app.use(userRouter.routes());
app.use(courseRouter.routes());
app.use(cateroryRouter.routes());
app.use(videoRouter.routes());
app.use(privacyRouter.routes());
app.use(commentRouter.routes());
app.use(questionRouter.routes());
app.use(excerciseRouter.routes());
app.use(assetsRouter.routes());

app.use(userRouter.allowedMethods());
app.use(courseRouter.allowedMethods());
app.use(cateroryRouter.allowedMethods());
app.use(videoRouter.allowedMethods());
app.use(privacyRouter.allowedMethods());
app.use(commentRouter.allowedMethods());
app.use(questionRouter.allowedMethods());
app.use(excerciseRouter.allowedMethods());
app.use(assetsRouter.allowedMethods());


// 404 page
app.use(notFound);

app.listen({port: 8000});
console.log("Started at localhost:8000");