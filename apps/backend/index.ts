import { html } from "@elysiajs/html";
import staticPlugin from "@elysiajs/static";
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
  .get("/website/*", () => {
    return Bun.file(path.resolve(import.meta.dir, "../../dist/index.html"));
  })
  .use(
    staticPlugin({
      prefix: "/website",
      assets: path.resolve(import.meta.dir, "../../dist"),
      alwaysStatic: true,
    }),
  )
  .listen(3000);
