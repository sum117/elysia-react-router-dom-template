import { html } from "@elysiajs/html";
import Elysia from "elysia";
import path from "path";
const app = new Elysia();

app
  .use(html())
  .onError((context) => {
    if (context.code === "NOT_FOUND") {
      context.set.status = 404;
      return "Not Found";
    }
    context.set.status = 500;
    return "Internal Server Error";
  })
  .get("/website/*", async (context) => {
    const assetsRegex = /\.(js|css|png|jpg|jpeg)$/;
    if (assetsRegex.test(context.request.url)) {
      const fileName = new URL(context.request.url).pathname.split("/").pop();
      if (!fileName) throw new Error("Not Found");

      const asset = Bun.file(path.resolve(import.meta.dir, "..", "..", "dist", "assets", fileName));
      if (!(await asset.exists())) throw new Error("Not Found");

      const data = await asset.text();
      return new Response(data, { headers: { "Content-Type": asset.type } });
    }

    const indexHtml = Bun.file(path.resolve(import.meta.dir, "..", "..", "dist", "index.html"));
    if (!(await indexHtml.exists())) throw new Error("Not Found");

    const html = await indexHtml.text();
    return context.html(html);
  })
  .listen(3000);

// import express from "express";
// const app = express();
// const DIST_DIR = path.resolve(import.meta.dir, "..", "..", "dist");

// app.use("/website", express.static(DIST_DIR));
// app.get("/website/*", (request, response) => {
//   const indexPath = path.join(DIST_DIR, "index.html");
//   response.sendFile(indexPath);
// });

// app.use((_request, response) => {
//   response.status(404).send("Not Found");
// });

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
