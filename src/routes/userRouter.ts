import { Router, Request, Response } from "express";
import { setDatabaseConnection } from "../middleware/setDatabase";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { leadinsertquery, getuserIdCategoryIdquery } from "../queries/lead";
import { time } from "console";

const userRouter = Router();

userRouter.get(
  "/lead/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    res.send([
      {
        leadId: 1,
        leadName: "Lead 1",
        leadStatus: "Open",
        leadOwner: "User 1",
        leadSource: "Source 1",
        companyName: "Company 1",
        productList: ["Product 1", "Product 2"],
        timeFrame: "1-2 months",
        userCode: req.body.user.UserCode,
      },
      {
        leadId: 2,
        leadName: "Lead 2",
        leadStatus: "Open",
        leadOwner: "User 2",
        leadSource: "Source 2",
        companyName: "Company 2",
        productList: ["Product 1", "Product 2"],
        timeFrame: "2-3 months",
        userCode: req.body.user.UserCode,
      },
      {
        leadId: 3,
        leadName: "Lead 3",
        leadStatus: "Open",
        leadOwner: "User 3",
        leadSource: "Source 3",
        companyName: "Company 3",
        productList: ["Product 1", "Product 2"],
        timeFrame: "3-4 months",
        userCode: req.body.user.UserCode,
      },
    ]);
  }
);
userRouter.post(
  "/lead/insert",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const querydata = req.body;
      const userId_categoryId_data = await (req as any).knex.raw(
        getuserIdCategoryIdquery,
        [2361, querydata.category, querydata.user.uid]
      );
      const categoryID = userId_categoryId_data[0].CategoryID;
      const userID = userId_categoryId_data[0].UserID;
      const mode = "INSERT";
      const params = {
        CompanyName: querydata.user.company,
        FormId: "2361",
        CategoryId: categoryID,
        ScreenName: "Lead Screen",
        UserId: userID,
        UDF_CompanyName_2361: querydata.customerCompanyName,
        UDF_ContactPerson_2361: querydata.contactPerson,
        UDF_Designation_2361: querydata.designation,
        UDF_MobileNo_2361: querydata.mobileNo,
        UDF_EmailId_2361: querydata.emailId,
        UDF_Product_2361: querydata.product,
        UDF_LeadSource_2361: querydata.leadSource,
        UDF_CompetitionWith_2361: querydata.competition,
        UDF_TimeFrame_2361: querydata.timeFrame,
        UDF_LeadRemindDate_2361: querydata.leadRemindDate,
        UDF_CustomerApplication_2361: querydata.customerApplication,
        UDF_CustomerExistingMachine_2361: querydata.customerExistingMachine,
        UDF_LeadNotes_2361: querydata.leadNote,
      };
      const data = await (req as any).knex.raw(leadinsertquery, [
        mode,
        params.CompanyName,
        params.FormId,
        params.CategoryId,
        params.ScreenName,
        params.UserId,
        params.UDF_CompanyName_2361,
        params.UDF_ContactPerson_2361,
        params.UDF_Designation_2361,
        params.UDF_MobileNo_2361,
        params.UDF_EmailId_2361,
        params.UDF_Product_2361,
        params.UDF_LeadSource_2361,
        params.UDF_CompetitionWith_2361,
        params.UDF_TimeFrame_2361,
        params.UDF_LeadRemindDate_2361,
        params.UDF_CustomerApplication_2361,
        params.UDF_CustomerExistingMachine_2361,
        params.UDF_LeadNotes_2361,
      ]);
      if (data[0].Output == 0) {
        throw new Error("Error while inserting lead, Please Try again");
      }
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default userRouter;
