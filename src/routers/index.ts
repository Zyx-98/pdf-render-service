import { Router } from "express";
import generateReportRoute from "./generate-report";

const router = Router();
const routers = [{ prefix: "generate-report", router: generateReportRoute }];

routers.forEach((r) => {
  router.use(`/v1/${r.prefix}`, r.router);
});

export default router;
