import fs from "fs";
import path from "path";
import { Router, Request, Response, query } from "express";
import { setDatabaseConnection } from "../middleware/setDatabase";
import { authenticateJWT } from "../middleware/authenticateJWT";
import {
  leadinsertquery,
  getuserIdCategoryIdquery,
  getleads,
  leadFollowupInsertQuery,
  CRM_GetAllLeadReminders,
} from "../queries/lead";
import {
  getfollowupinquiry,
  getfollowupquotation,
  followupinquiryinsertquery,
  followupquotationinsertquery,
  getUseridCategoryidfollowup,
  getfollowup,
  CRM_GetAllQuotationReminders,
} from "../queries/followup";
import { uploadFiles } from "../middleware/uploadFiles";
import { expensegetdetailsquery, expenseinsertquery } from "../queries/expense";
import { changepassword, dashboardanalytics, getcalender } from "../queries/homepage";
import { FOLLOWUP_IMAGE_BASE_PATH, IMAGE_BASE_PATH } from "../config/constants";
import checkFilePath from "../middleware/checkFilePath";

const userRouter = Router();

userRouter.get(
  "/dashboard/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const [dashboard_data, lead_reminders_data, quotation_reminders_data] = await Promise.all([
        (req as any).knex.raw(dashboardanalytics, [
          req.body.user.uid,
          req.query.timeframe,
        ]),
        (req as any).knex.raw(CRM_GetAllLeadReminders),
        (req as any).knex.raw(CRM_GetAllQuotationReminders),
      ]);

      const data = {
        dashboard: dashboard_data,
        leadReminders: lead_reminders_data.filter(
          (reminder: any) => reminder.UserIdentification === req.body.user.uid
        ),
        quotationReminders: quotation_reminders_data.filter(
          (reminder: any) => reminder.UserIdentification === req.body.user.uid
        ),
      }
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

userRouter.get(
  "/calendar/dates",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const rawData = await (req as any).knex.raw(getcalender, [
        req.body.user.uid,
      ]);
      res.status(200).json(rawData);
      const formattedData = rawData.reduce(
        (acc: Record<string, any[]>, item: any) => {
          const {
            Date: date,
            MachineName: machineName,
            PartyName: partyName,
            Time: time,
          } = item;

          if (!acc[date]) {
            acc[date] = [];
          }

          acc[date].push({
            machineName,
            partyName,
            time,
          });

          return acc;
        },
        {}
      );

      res.status(200).json(formattedData);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

userRouter.patch(
  "/password",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const querydata = req.body;
      console.log("pass querydata: ", querydata);

      const data = await (req as any).knex.raw(changepassword, [
        req.body.user.uid,
        querydata.currentPassword,
        querydata.newPassword,
      ]);

      if (data[0].Output == 0) {
        return res
          .status(400)
          .json({ error: "Failed to change password. Please try again." });
      }
      if (data[0].Output == -1) {
        return res.status(400).json({ error: "Old password is incorrect" })
      }
      res.status(200).json(data)
    } catch (err: any) {
      console.log("Error: ", err);
      res.status(500).json({ error: err.message });
    }
  }
);

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
        UDF_CustomerAdd_2361: querydata.address,
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
        params.UDF_CustomerAdd_2361,
      ]);
      if (data[0].Output == 0) {
        throw new Error(
          data[0].ErrorMessage ||
          "Error while updating lead, Please Try again"
        );
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

      const savedFiles = files.map((file) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = `${req.body.user.uid}_${uniqueSuffix}${path.extname(
          file.originalname
        )}`;
        const filepath = path.join(IMAGE_BASE_PATH, filename);

        fs.writeFileSync(filepath, file.buffer);

        return {
          originalname: file.originalname,
          filename: filename,
          path: filepath,
          size: file.size,
        };
      });

      const filePaths = savedFiles.map((file) => file.filename).join(",");

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
        UDF_CustomerAdd_2361: querydata.address,
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
        params.UDF_CustomerAdd_2361,
      ]);
      if (data[0].Output == 0) {
        throw new Error(
          data[0].ErrorMessage ||
          "Error while inserting lead, Please Try again"
        );
      }
      res.status(200).json(data);
    } catch (err: any) {
      console.log("Error: ", err);
      res.status(500).json({ error: err.message });
    }
  }
);

userRouter.get(
  "/lead/images/:filename",
  authenticateJWT,
  setDatabaseConnection,
  checkFilePath,
  (req: Request, res: Response) => {

    const filename = "\\" + req.params.filename;
    const filePath = path.join(IMAGE_BASE_PATH, filename);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(err, filePath);
        return res.status(404).send("Image not found");
      }

      // Set appropriate content type
      const ext = path.extname(filename).toLowerCase();
      const contentType =
        {
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".gif": "image/gif",
          ".webp": "image/webp",
        }[ext] || "application/octet-stream";

      res.set("Content-Type", contentType);

      // Stream the file
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    });
  }
);

userRouter.post(
  "/lead/updates/insert",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const querydata = req.body;

      const params = {
        ReferenceTransactionId: querydata.ReferenceTransactionId,
        NextVisitDateTime: new Date(querydata.NextVisitDateTime).toISOString(),
        FollowupStatus: querydata.FollowupStatus,
        FollowupDetails: querydata.FollowupDetails,
        FollowupDateTime: new Date(querydata.FollowupDateTime).toISOString(),
        CloseReason: querydata.CloseReason,
        ModeOfContact: querydata.ModeOfContact,
        DetailDescription: querydata.DetailDescription,
        VisitTo: querydata.VisitTo,
        VisitorPerson: querydata.VisitorPerson,
      };

      const data = await (req as any).knex.raw(leadFollowupInsertQuery, [
        params.ReferenceTransactionId,
        params.NextVisitDateTime,
        params.FollowupStatus,
        params.FollowupDateTime,
        params.FollowupDetails,
        params.CloseReason,
        params.ModeOfContact,
        params.DetailDescription,
        params.VisitTo,
        params.VisitorPerson,
      ]);
      if (data[0].Output == 0) {
        throw new Error("Error while inserting lead updates, Please Try again");
      }
      res.status(200).json(data);
    } catch (err: any) {
      console.log("Error: ", err);
      res.status(500).json({ error: err.message });
    }
  }
)

userRouter.get(
  "/lead/reminders",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const data = await (req as any).knex.raw(
        CRM_GetAllLeadReminders);
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
)


userRouter.get(
  "/followup/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const querydata = req.query;
      const params = {
        Usercode: req.body.user.uid,
        InquiryId: Number(querydata.SalesInquiryId),
        QuotationId: Number(querydata.SalesQuotationId),
        Type: querydata.type,
      };
      const data = await (req as any).knex.raw(getfollowup, [
        params.Usercode,
        params.InquiryId,
        params.QuotationId,
        params.Type,
      ]);
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

userRouter.get(
  "/followup/inquiry/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const data = await (req as any).knex.raw(getfollowupinquiry, [
        req.body.user.uid,
      ]);
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

userRouter.get(
  "/followup/quotation/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const data = await (req as any).knex.raw(getfollowupquotation, [
        req.body.user.uid,
      ]);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
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
          data[0].ErrorMessage ||
          "Error while inserting quotation followup, Please Try again"
        );
      }
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({error: err.message });
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
          "C:\\Program Files (x86)\\Nutec Infotech Pvt Ltd\\DigitalSignaturePdfFile\\CRM\\EXPENSE",
          // "C:\\CRM\\Expense\\",
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

userRouter.get(
  "/quotation/reminders",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const data = await (req as any).knex.raw(
        CRM_GetAllQuotationReminders);
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
)

userRouter.get(
  "/images/:filename",
  authenticateJWT,
  setDatabaseConnection,
  checkFilePath,
  (req: Request, res: Response) => {
    const company = req.body.user.company;
    let companyPath;
    switch (company) {
      case "PrashantGamatex":
        companyPath = "//PGPL_Temp//";
        break;
      case "Ferber":
        companyPath = "//PFPL//";
        break;
      case "WestPoint":
        companyPath = "//PWPL//";
        break;
      default:
        companyPath = "//PGPL_Temp//";
        break;
    }


    const filename = req.params.filename;
    const filePath = path.join(FOLLOWUP_IMAGE_BASE_PATH, companyPath, filename);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(err, filePath);
        return res.status(404).send("Image not found");
      }

      // Set appropriate content type
      const ext = path.extname(filename).toLowerCase();
      const contentType =
        {
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".gif": "image/gif",
          ".webp": "image/webp",
        }[ext] || "application/octet-stream";

      res.set("Content-Type", contentType);

      // Stream the file
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    });
  }
);

export default userRouter;
