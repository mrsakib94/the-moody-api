export interface Account {
  account_number: string;
  name: string;
}

export interface MoodyApiResponse {
  message: Account[];
}
