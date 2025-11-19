import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "../uploadthing/core";

export const { POST, GET } = createRouteHandler({
    router: ourFileRouter,
})