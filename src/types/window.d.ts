// src/types/reockeAPI.d.ts

export type AuthPassword = {
  password: string;
  newPassword?: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
};

declare global {
  interface Window {
    relockeAPI: {
      logout: () => Promise<void>;
      newWallet: (data: AuthPassword) => Promise<AuthResponse>;
      login: (data: AuthPassword) => Promise<AuthResponse>;
      changePassword: (data: AuthPassword) => Promise<AuthResponse>;
      insertKey: (data: { wif_private_key: string }) => Promise<AuthResponse>;
      deleteKey: (data: { wif_public_key: string }) => Promise<AuthResponse>;
      getPublicKeys: () => Promise<string[]>;
      getWallet: () => Promise<boolean>;
      deleteWallet: () => Promise<AuthResponse>;
      isOpen: () => Promise<Boolean>;
    };
  }
}

export {};
