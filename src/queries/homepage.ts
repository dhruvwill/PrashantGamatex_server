export const dashboardanalytics = `
    EXEC [CRM_GetDashboardAnalytics]
        @Usercode= ?,
        @Timeframe=?
`

export const getcalender = `
    EXEC [CRM_GetCalenderDates]
        @Usercode= ?
`

export const changepassword = `
    DECLARE @Output INT;
    EXEC [dbo].[CRM_ChangePassword]
        @Usercode= ?,
        @OldPassword= ?,
        @Newpassword= ?,
        @Output = @Output OUTPUT
    SELECT @Output AS Output;
`
export const CRM_GetAllQuotationRemindersDashboard = `
    EXEC [dbo].[CRM_GetAllQuotationRemindersDashboard]
`
export const CRM_GetAllLeadRemindersDashboard = `
    EXEC [dbo].[CRM_GetAllLeadRemindersDashboard] 
`