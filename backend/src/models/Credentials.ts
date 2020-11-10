class Credentials {
  private _companyName: string;
  private _companyId: string;
  private _accountName: string;
  private _accountId: string;
  private _userName: string;
  private _userId: string;
  private _token: string;

  constructor(
    accountName: string,
    companyName: string,
    userName: string,
    token: string,
    accountId: string | null | undefined = null,
    companyId: string | null | undefined = null,
    userId: string | null | undefined = null,
  ) {
    this._companyName = companyName;
    this._accountName = accountName;
    this._userName = userName;
    this._token = token;
    this._accountId = accountId;
    this._companyId = companyId;
    this._userId = userId;
  }

  public getCompany(): string {
    return this._companyName;
  }

  public setCompany(_company: string): Credentials {
    this._companyName = _company;
    return this;
  }

  public getCompanyId(): string {
    return this._companyId;
  }

  public setCompanyId(_companyId: string): Credentials {
    this._companyId = _companyId;
    return this;
  }

  public getAccount(): string {
    return this._accountName;
  }

  public getAccountId(): string {
    return this._accountId;
  }

  public getUser(): string {
    return this._userName;
  }

  public getUserId(): string {
    return this._userId;
  }

  public getToken(): string {
    return this._token;
  }

  public toString() {
    return `[AccountId:${this._accountId} CompanyId:${this._companyId} UserId:${this._userId}]`;
  }

  public clone(): Credentials {
    return new Credentials(this._accountName, this._companyName, this._userName, this._token, this._accountId, this._companyId, this._userId);
  }
}

export = Credentials;
