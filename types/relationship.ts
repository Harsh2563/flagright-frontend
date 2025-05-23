import { ITransaction } from "./transaction";
import { IUser } from "./user";

export interface IUserRelationshipData {
  relationshipType: string;
  user: IUser;
}

export interface IUserTransactionData {
  transaction: ITransaction;
  relatedUser: IUser;
}

export interface IUserRelationshipGraphResponse {
  status: string;
  data: {
    directRelationships: IUserRelationshipData[];
    transactionRelationships: IUserRelationshipData[];
    sentTransactions: IUserTransactionData[];
    receivedTransactions: IUserTransactionData[];
  };
}

export interface IUserRelationshipGraphProps {
  relationships:
    | IUserRelationshipGraphResponse[]
    | IUserRelationshipGraphResponse
    | null;
  isLoading?: boolean;
  centerUserId?: string;
}
