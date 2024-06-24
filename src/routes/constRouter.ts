import { Router, Request, Response } from "express";
import { setDatabaseConnection } from "../middleware/setDatabase";
import { constantsquery } from "../queries/lead";
import { authenticateJWT } from "../middleware/authenticateJWT";

const constRouter = Router()

constRouter.get("/get",authenticateJWT,setDatabaseConnection,async (req: Request, res: Response) => {
    const params = {
        LeadSource: "LeadSource",
        Category: "Category",
        TimeFrame: "TimeFrame",
        Currency: "Currency"
    }
    const data = await (req as any).knex.raw(constantsquery,[
        params.LeadSource,
        params.TimeFrame,
        params.Currency,
        params.Category
    ])
    res.json(data)
})

export default constRouter