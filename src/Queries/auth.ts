export const userloginquery = `
    EXEC [CRM_UserLogin]
	    @Username=?,
	    @Password=?
    `