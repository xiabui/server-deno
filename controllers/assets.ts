export default {
    getImage: async ({ params, response }: { params: { name: string }; response: any },) => {

        const img = await Deno.readFile(`../assets/images/${params.name}`);

        const head = new Headers();
        head.set('content-type', 'image/png');

        response.respond({ headers: head, body: img, status: 200 });
    }
}