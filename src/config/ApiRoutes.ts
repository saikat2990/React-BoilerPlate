
export class ApiRoutes{
    static BaseUrl = process.env.REACT_APP_API_BASE_URL || "";
    static GetUsers = `${this.BaseUrl}/api/users`;
    
    static Auth = `${this.BaseUrl}/api/Auth`;
    static Login = `${this.BaseUrl}/api/login`;

    static GetIncomesByDateRange = `${this.BaseUrl}/Income/GetByDateRange`;
    static GetExpensesByDateRange = `${this.BaseUrl}/Expense/GetByDateRange`;
    static GetReconciliationByDateRange = `${this.BaseUrl}/Reconciliation/GetByDateRange`;
    static UpdateReconciliation = `${this.BaseUrl}/Reconciliation`;
    static CreateReconciliation = `${this.BaseUrl}/Reconciliation`;
    static GetCostTypes = `${this.BaseUrl}/Reconciliation/GetCostTypes`;
};