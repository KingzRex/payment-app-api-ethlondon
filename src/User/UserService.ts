import DbClient from "../Db/xataClient";
import { NOT_FOUND } from "../Resources/Constants/StatusCodes";
import { HttpException } from "../Resources/exceptions/HttpExceptions";
import { User } from "./UserTypes";

class UserService {
  private UserTable = DbClient.User;

  async getUserByEmail(email: string) {
    const userData = await this.UserTable.filter({ email })
      .select([
        "id",
        "email",
        "firstName",
        "lastName",
        "phoneNumber",
        "bvn",
        {
          name: "<-VirtualAccount.user",
          columns: ["accountName", "bankName", "accountNumber"],
        },
      ])
      .getFirst();

    const user: User | null = userData ? (userData as User) : null;

    if (!user) throw new HttpException(NOT_FOUND, "User not found");

    return user;
  }

  async createNewUser(payload: { email: string }) {
    await this.UserTable.create(payload);
  }

  async checkExists(email: string) {
    const user = await this.UserTable.filter({
      email,
    }).getFirst();

    return Boolean(user);
  }

  async updateSmartWalletAddress(userId: string, walletAddress: string) {
    await this.UserTable.update(userId, {
      smartWalletAddress: walletAddress,
    });
  }
}

export default new UserService();