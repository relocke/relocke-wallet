export type AuthPassword = {
  password: string;
  newPassword?: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
};

export type IpcChannelArgs = {
  "create-new-wallet": AuthPassword;
  "get-wallet": undefined;
  login: AuthPassword;
  logout: undefined;
  "change-password": AuthPassword;
  "insert-key": { wif_private_key: string };
  "delete-key": { wif_public_key: string };
  "get-public-keys": undefined;
};

export type IpcChannels = keyof IpcChannelArgs;

declare global {
  namespace Electron {
    interface IpcMain {
      handle<T extends IpcChannels>(
        channel: T,
        listener: (
          event: Electron.IpcMainInvokeEvent,
          data: IpcChannelArgs[T]
        ) => Promise<any>
      ): void;
    }
  }
}
