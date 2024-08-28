export const dashboardanalytics = `
    EXEC [CRM_GetDashboardAnalytics]
        @Usercode= ?,
        @Timeframe=?
`

export const getcalender = `
    EXEC [CRM_GetCalenderDates]
        @Usercode= ?
`