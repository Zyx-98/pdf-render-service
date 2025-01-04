import { Router } from "express";
import generateReport from "./generate-report";

const router = Router();
const routers = [{ prefix: "generate-report", router: generateReport }];

routers.forEach((r) => {
  router.use(`/v1/${r.prefix}`, r.router);
});

export default router;
