import React from "react";

interface WalletHookReturnType {
  handleDelete: (wif_public_key: string) => Promise<void>;
  handleUpdatePassword: (fd: FormData) => Promise<void>;
  handleLogout: () => Promise<void>;
  insertKey: (fd: FormData) => Promise<void>;
  public_keys: string[];
  isPending: boolean;
  password: string;
  success: string;
  setSuccess: (bool: boolean) => Promise<void>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

export default function useWallet(): WalletHookReturnType {
  const [public_keys, setPublic_keys] = React.useState([] as string[]);
  const [isPending, startTransition] = React.useTransition();
  const [password, setPassword] = React.useState("");
  const [success, setSuccess] = React.useState("");

  async function getPubKeys() {
    const public_keys = await window.relockeAPI.getPublicKeys();
    return setPublic_keys(public_keys);
  }

  async function handleDelete(wif_public_key: string) {
    if (
      window.confirm(
        "Are you sure you want to delete the key, this action is irreversible."
      )
    ) {
      await window.relockeAPI.deleteKey({ wif_public_key });
      await getPubKeys();
    }
  }

  async function handleUpdatePassword(fd: FormData) {
    const password = fd.get("password") as string;
    const newPassword = fd.get("new-password") as string;

    const data = await window.relockeAPI.changePassword({
      password,
      newPassword,
    });

    if (!data.success) throw new Error(data.message);
    setSuccess("Successfully updated your wallet password.");
  }

  async function handleLogout() {
    if (window.confirm("Confirm that you want to logout")) {
      await window.relockeAPI.logout();
      window.location.hash = "#";
    }
  }

  async function insertKey(fd: FormData) {
    const wif_private_key = fd.get("wif_private_key") as string;
    const { success } = await window.relockeAPI.insertKey({ wif_private_key });
    if (!success) throw new Error("Unable to update wallet at this time.");
    await getPubKeys();
  }

  React.useEffect(() => {
    startTransition(async () => {
      await getPubKeys();
    });
  }, []);

  return {
    handleDelete,
    handleUpdatePassword,
    handleLogout,
    insertKey,
    public_keys,
    isPending,
    password,
    setPassword,
    success,
    setSuccess,
  };
}
