export const dashboardanalytics = `
    EXEC [CRM_GetDashboardAnalytics]
        @Usercode= ?
`

export const leadreminddate = `
    EXEC [CRM_GetLeadRemindDate]
        @Usercode= ?
`

export const followupnextdatetime = `
    EXEC [CRM_GetFollowupNextVisitDate]
        @Usercode= ?
`