import React, { ReactNode, useContext } from "react";
import useKeyPress from "../../hooks/useKeyPress";
import Button, { ButtonProps } from "../Button";
import useClickRef from "../../hooks/useClickRef";
import styles from "./index.module.css";

// Define types for the MenuContext value
interface MenuContextType {
  menuState: boolean;
  setMenuState: React.Dispatch<React.SetStateAction<boolean>>;
}

// Default context value (for TypeScript inference)
const MenuContext = React.createContext<MenuContextType | undefined>(undefined);

// Type for MenuProvider props
interface MenuProviderProps {
  children: ReactNode;
  open?: boolean;
}

export function MenuProvider({ children, open = false }: MenuProviderProps) {
  const [menuState, setMenuState] = React.useState<boolean>(open);
  useKeyPress("Escape", () => setMenuState(false));
  const ref = useClickRef(() => setMenuState(false));

  return (
    <MenuContext.Provider value={{ menuState, setMenuState }}>
      <div className={styles.container} ref={ref}>
        {children}
      </div>
    </MenuContext.Provider>
  );
}

// Type for MenuButton props
interface MenuButtonProps extends ButtonProps {
  children: ReactNode;
  open?: boolean;
}

export function MenuButton({
  children,
  open = false,
  ...props
}: MenuButtonProps) {
  const { menuState, setMenuState } = useContext(MenuContext)!; // Non-null assertion because we expect context to be provided

  return (
    <Button
      className={styles.container}
      onClick={() => setMenuState(!menuState)}
      {...props}
    >
      {children}
    </Button>
  );
}

// Type for MenuDropDown props
interface MenuDropDownProps {
  children: ReactNode;
}

export function MenuDropDown({ children }: MenuDropDownProps) {
  const { menuState } = useContext(MenuContext)!; // Non-null assertion

  return menuState && <div className={styles.menuDropDown}>{children}</div>;
}
