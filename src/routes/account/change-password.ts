import { RequestHandler, Router } from "express";

const handler: RequestHandler = async (req, res) => {};

export default (router: Router) => router.post("/change-password", handler);
