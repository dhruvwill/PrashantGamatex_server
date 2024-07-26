import fs from "fs";
import path from "path";
import { Router, Request, Response, query } from "express";
import { setDatabaseConnection } from "../middleware/setDatabase";
import { authenticateJWT } from "../middleware/authenticateJWT";
import {
  leadinsertquery,
  getuserIdCategoryIdquery,
  getleads,
} from "../queries/lead";
import {
  getfollowupinquiry,
  getfollowupquotation,
  followupinquiryinsertquery,
  followupquotationinsertquery,
  getUseridCategoryidfollowup,
} from "../queries/followup";
import { uploadFiles } from "../middleware/uploadFiles";
import { expensegetdetailsquery, expenseinsertquery } from "../queries/expense";

const userRouter = Router();

userRouter.get(
  "/lead/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    const data = await (req as any).knex.raw(getleads, [req.body.user.uid]);
    res.json(data);
  }
);

userRouter.patch(
  "/lead/update",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const querydata = req.body;

      const userId_categoryId_currencyId_data = await (req as any).knex.raw(
        getuserIdCategoryIdquery,
        [2361, querydata.user.uid, querydata.currency]
      );
      const categoryID = userId_categoryId_currencyId_data[0].CategoryID;
      const userID = userId_categoryId_currencyId_data[0].UserID;
      const currencyID = userId_categoryId_currencyId_data[0].CurrencyID;

      const mode = "UPDATE";
      const params = {
        CompanyName: querydata.user.company,
        FormId: 2361,
        DocumentDate: new Date().toISOString().replace("T", " "),
        CategoryId: Number(categoryID),
        ScreenName: "Lead Screen",
        UserId: Number(userID),
        CurrencyID: Number(currencyID),
        ImageAttachment: "",
        RecordId: querydata.RecordId,
        UDF_CompanyName_2361: querydata.customerCompanyName,
        UDF_ContactPerson_2361: querydata.contactPerson,
        UDF_Designation_2361: querydata.designation,
        UDF_MobileNo_2361: querydata.mobileNo,
        UDF_EmailId_2361: querydata.emailId,
        UDF_Product_2361: querydata.product,
        UDF_LeadSource_2361: querydata.leadSource,
        UDF_CompetitionWith_2361: querydata.competition,
        UDF_TimeFrame_2361: querydata.timeFrame,
        UDF_LeadRemindDate_2361: new Date(querydata.leadRemindDate)
          .toISOString()
          .replace("T", " "),
        UDF_CustomerApplication_2361: querydata.customerApplication,
        UDF_CustomerExistingMachine_2361: querydata.customerExistingMachine,
        UDF_LeadNotes_2361: querydata.leadNote,
      };
      const data = await (req as any).knex.raw(leadinsertquery, [
        mode,
        params.CompanyName,
        params.FormId,
        params.DocumentDate,
        params.CategoryId,
        params.ScreenName,
        params.UserId,
        params.RecordId,
        params.CurrencyID,
        params.ImageAttachment,
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
        throw new Error("Error while updating lead, Please Try again");
      }
      res.status(200).json(data);
    } catch (err: any) {
      console.log("Error: ", err);
      res.status(500).json({ error: err.message });
    }
  }
);
userRouter.post(
  "/lead/insert",
  uploadFiles,
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const querydata = req.body;
      const files = req.files as Express.Multer.File[];

      console.log("Data: ", req.body);

      const savedFiles = files.map((file) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = `${req.body.user.uid}_${uniqueSuffix}${path.extname(
          file.originalname
        )}`;
        const filepath = path.join(
          "C:\\Program Files (x86)\\Nutec Infotech Pvt Ltd\\DigitalSignaturePdfFile\\CRM",
          filename
        );

        fs.writeFileSync(filepath, file.buffer);

        return {
          originalname: file.originalname,
          filename: filename,
          path: filepath,
          size: file.size,
        };
      });

      const filePaths = savedFiles.map((file) => file.filename).join(",");
      console.log(filePaths);

      const userId_categoryId_currencyId_data = await (req as any).knex.raw(
        getuserIdCategoryIdquery,
        [2361, querydata.user.uid, querydata.currency]
      );
      const categoryID = userId_categoryId_currencyId_data[0].CategoryID;
      const userID = userId_categoryId_currencyId_data[0].UserID;
      const currencyID = userId_categoryId_currencyId_data[0].CurrencyID;

      const mode = "INSERT";
      const params = {
        CompanyName: querydata.user.company,
        FormId: 2361,
        DocumentDate: new Date().toISOString().replace("T", " "),
        CategoryId: Number(categoryID),
        ScreenName: "Lead Screen",
        UserId: Number(userID),
        RecordId: 0,
        CurrencyId: Number(currencyID),
        ImageAttachment: filePaths,
        UDF_CompanyName_2361: querydata.customerCompanyName,
        UDF_ContactPerson_2361: querydata.contactPerson,
        UDF_Designation_2361: querydata.designation,
        UDF_MobileNo_2361: querydata.mobileNo,
        UDF_EmailId_2361: querydata.emailId,
        UDF_Product_2361: querydata.product,
        UDF_LeadSource_2361: querydata.leadSource,
        UDF_CompetitionWith_2361: querydata.competition,
        UDF_TimeFrame_2361: querydata.timeFrame,
        UDF_LeadRemindDate_2361: new Date(querydata.leadRemindDate)
          .toISOString()
          .replace("T", " "),
        UDF_CustomerApplication_2361: querydata.customerApplication,
        UDF_CustomerExistingMachine_2361: querydata.customerExistingMachine,
        UDF_LeadNotes_2361: querydata.leadNote,
      };
      const data = await (req as any).knex.raw(leadinsertquery, [
        mode,
        params.CompanyName,
        params.FormId,
        params.DocumentDate,
        params.CategoryId,
        params.ScreenName,
        params.UserId,
        params.RecordId,
        params.CurrencyId,
        params.ImageAttachment,
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
      console.log("Data: ", data);
      res.status(200).json(data);
    } catch (err: any) {
      console.log("Error: ", err);
      res.status(500).json({ error: err.message });
    }
  }
);

userRouter.get(
  "/followup/inquiry/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    const data = await (req as any).knex.raw(getfollowupinquiry, [
      req.body.user.uid,
    ]);
    res.json(data);
  }
);

userRouter.get(
  "/followup/quotation/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    const data = await (req as any).knex.raw(getfollowupquotation, [
      req.body.user.uid,
    ]);
    res.json(data);
  }
);

userRouter.post(
  "/followup/inquiry/insert",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const querydata = req.body;
      const userId_categoryId = await (req as any).knex.raw(
        getUseridCategoryidfollowup,
        [querydata.user.uid, 208]
      );
      const categoryID = userId_categoryId[0].CategoryId;
      const userID = userId_categoryId[0].Userid;
      const mode = "INSERT";
      const params = {
        Mode: mode,
        SalesInquiryId: Number(querydata.SalesInquiryId),
        SalesInquiryDetailsId: Number(querydata.SalesInquiryDetailsId),
        CategoryId: Number(categoryID),
        UserId: Number(userID),
        DocumentNo: 0,
        // DocumentDate: querydata.DocumentDate,
        DocumentDate: new Date(querydata.DocumentDate)
          .toISOString()
          .replace("T", " "),
        // FollowupDateTime: querydata.FollowupDateTime,
        FollowupDateTime: new Date(querydata.FollowupDateTime).toISOString(),
        // FollowupEndDateTime: querydata.FollowupEndDateTime,
        FollowupEndDateTime: new Date(
          querydata.FollowupEndDateTime
        ).toISOString(),
        FollowupDetails: querydata.FollowupDetails,
        Visitto: querydata.VisitTo,
        VisitorPerson: querydata.VisitorPerson,
        // NextVisitDateTime: querydata.NextVisitDateTime,
        NextVisitDateTime: new Date(querydata.NextVisitDateTime).toISOString(),
        NextVisitPerson: querydata.NextVisitPerson,
        NextVisitorPerson: querydata.NextVisitorPerson,
        AttentionDetail: querydata.AttentionDetails,
        OrderGoesParty: querydata.OrderGoesParty,
        CloseReason: querydata.CloseReason,
        DetailDescription: querydata.DetailDescription,
        Rating: querydata.Rating,
        ModeofContact: querydata.ModeOfContact,
        FollowupStatus: querydata.FollowupStatus,
      };
      const data = await (req as any).knex.raw(followupinquiryinsertquery, [
        params.Mode,
        params.SalesInquiryId,
        params.SalesInquiryDetailsId,
        params.CategoryId,
        params.UserId,
        params.DocumentNo,
        params.DocumentDate,
        params.FollowupDateTime,
        params.FollowupEndDateTime,
        params.FollowupDetails,
        params.Visitto,
        params.VisitorPerson,
        params.NextVisitDateTime,
        params.NextVisitPerson,
        params.NextVisitorPerson,
        params.AttentionDetail,
        params.OrderGoesParty,
        params.CloseReason,
        params.DetailDescription,
        params.Rating,
        params.ModeofContact,
        params.FollowupStatus,
      ]);
      if (data[0].Output == 0) {
        throw new Error(
          "Error while inserting inquiry followup, Please Try again"
        );
      }
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);
userRouter.post(
  "/followup/quotation/insert",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const querydata = req.body;
      const mode = "INSERT";
      const userId_categoryId = await (req as any).knex.raw(
        getUseridCategoryidfollowup,
        [querydata.user.uid, 208]
      );
      const categoryID = userId_categoryId[0].CategoryId;
      const userID = userId_categoryId[0].Userid;
      const params = {
        SalesQuotationId: Number(querydata.SalesQuotationId),
        SalesQuotationDetailsId: Number(querydata.SalesQuotationDetailsId),
        CategoryId: Number(categoryID),
        UserId: Number(userID),
        DocumentNo: 0,
        DocumentDate: new Date(querydata.DocumentDate)
          .toISOString()
          .replace("T", " "),
        FollowupDateTime: new Date(querydata.FollowupDateTime).toISOString(),
        FollowupEndDateTime: new Date(
          querydata.FollowupEndDateTime
        ).toISOString(),
        FollowupDetails: querydata.FollowupDetails,
        Visitto: querydata.VisitTo,
        VisitorPerson: querydata.VisitorPerson,
        NextVisitDateTime: new Date(querydata.NextVisitDateTime).toISOString(),
        NextVisitPerson: querydata.NextVisitPerson,
        NextVisitorPerson: querydata.NextVisitorPerson,
        AttentionDetail: querydata.AttentionDetails,
        OrderGoesParty: querydata.OrderGoesParty,
        CloseReason: querydata.CloseReason,
        DetailDescription: querydata.DetailDescription,
        Rating: querydata.Rating,
        ModeofContact: querydata.ModeOfContact,
        FollowupStatus: querydata.FollowupStatus,
      };
      const data = await (req as any).knex.raw(followupquotationinsertquery, [
        mode,
        params.SalesQuotationId,
        params.SalesQuotationDetailsId,
        params.CategoryId,
        params.UserId,
        params.DocumentNo,
        params.DocumentDate,
        params.FollowupDateTime,
        params.FollowupEndDateTime,
        params.FollowupDetails,
        params.Visitto,
        params.VisitorPerson,
        params.NextVisitDateTime,
        params.NextVisitPerson,
        params.NextVisitorPerson,
        params.AttentionDetail,
        params.OrderGoesParty,
        params.CloseReason,
        params.DetailDescription,
        params.Rating,
        params.ModeofContact,
        params.FollowupStatus,
      ]);
      if (data[0].Output == 0) {
        throw new Error(
          "Error while inserting quotation followup, Please Try again"
        );
      }
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

userRouter.get(
  "/expense/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const data = await (req as any).knex.raw(expensegetdetailsquery, [
        req.body.user.uid,
      ]);
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

userRouter.post(
  "/expense/insert",
  uploadFiles,
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const querydata = req.body;

      const uploadedFiles = req.files as Express.Multer.File[];
      console.log("Files: ", uploadedFiles);

      const filePaths: string[] = new Array(querydata.expenseItems.length).fill(
        ""
      );

      const savedFiles = uploadedFiles.map((file) => {
        const match = file.fieldname.match(
          /expenseItems\[(\d+)\]\[attachment\]/
        );

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = `${req.body.user.uid}_${uniqueSuffix}${path.extname(
          file.originalname
        )}`;
        const filepath = path.join(
          // "C:\\Program Files (x86)\\Nutec Infotech Pvt Ltd\\DigitalSignaturePdfFile\\CRM",
          "C:\\CRM\\Expense\\",
          filename
        );

        if (match) {
          const index = parseInt(match[1]);
          filePaths[index] = filename;
        }

        fs.writeFileSync(filepath, file.buffer);

        return {
          originalname: file.originalname,
          filename: filename,
          path: filepath,
          size: file.size,
        };
      });

      console.log("File paths: ", filePaths);

      console.log("Data: ", querydata);
      const companyName = querydata.customerCompany;
      const visitDate = querydata.visitDate;
      const userCode = querydata.user.uid;
      let data;

      for (let i = 0; i < querydata.expenseItems.length; i++) {
        const item = querydata.expenseItems[i];

        const params = {
          Usercode: userCode,
          ExpDate: new Date(visitDate).toISOString(),
          CustomerCompanyName: companyName,
          ExpType: item.type,
          ExpDesc: item.description,
          ExpAmount: Number(item.amount),
          ExpImage: filePaths[i], // Use the filename from filePaths array
        };

        data = await (req as any).knex.raw(expenseinsertquery, [
          params.Usercode,
          params.ExpDate,
          params.CustomerCompanyName,
          params.ExpType,
          params.ExpDesc,
          params.ExpAmount,
          params.ExpImage,
        ]);

        if (data[0].Output == 0) {
          throw new Error("Error while inserting expense, Please Try again");
        }
      }
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default userRouter;
