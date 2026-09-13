import { onRequestPost as __api_login_ts_onRequestPost } from "D:\\Resources\\tests\\GLM26.9\\02-博客项目\\pure-blog\\functions\\api\\login.ts"
import { onRequestGet as __api_posts_ts_onRequestGet } from "D:\\Resources\\tests\\GLM26.9\\02-博客项目\\pure-blog\\functions\\api\\posts.ts"
import { onRequestPost as __api_posts_ts_onRequestPost } from "D:\\Resources\\tests\\GLM26.9\\02-博客项目\\pure-blog\\functions\\api\\posts.ts"
import { onRequestGet as __online__slug__ts_onRequestGet } from "D:\\Resources\\tests\\GLM26.9\\02-博客项目\\pure-blog\\functions\\online\\[slug].ts"
import { onRequestGet as __admin_ts_onRequestGet } from "D:\\Resources\\tests\\GLM26.9\\02-博客项目\\pure-blog\\functions\\admin.ts"
import { onRequestPost as __admin_ts_onRequestPost } from "D:\\Resources\\tests\\GLM26.9\\02-博客项目\\pure-blog\\functions\\admin.ts"

export const routes = [
    {
      routePath: "/api/login",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_login_ts_onRequestPost],
    },
  {
      routePath: "/api/posts",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_posts_ts_onRequestGet],
    },
  {
      routePath: "/api/posts",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_posts_ts_onRequestPost],
    },
  {
      routePath: "/online/:slug",
      mountPath: "/online",
      method: "GET",
      middlewares: [],
      modules: [__online__slug__ts_onRequestGet],
    },
  {
      routePath: "/admin",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__admin_ts_onRequestGet],
    },
  {
      routePath: "/admin",
      mountPath: "/",
      method: "POST",
      middlewares: [],
      modules: [__admin_ts_onRequestPost],
    },
  ]