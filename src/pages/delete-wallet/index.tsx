import React from "react";
import styles from "./index.module.css";
import Form from "../../components/Form";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Link from "../../components/Link";
import HoverDiv from "../../components/HoverDiv";

export default function DeteleWallet() {
  async function handleDelete() {
    if (
      window.confirm(
        "Confirm that you want to delete your wallet! This action cannot be undone and all your keys will be erased."
      )
    ) {
      await window.relockeAPI.deleteWallet();
      window.location.hash = "#";
    }
  }

  return (
    <div className={styles.container}>
      <HoverDiv className={styles.container2}>
        <h2>Delete Wallet</h2>
        <p>
          To confirm that you want to delete your wallet, please type in the
          field below “
          <b>I&nbsp;want&nbsp;to&nbsp;delete&nbsp;my&nbsp;wallet</b>
          ”.
        </p>
        <Form action={handleDelete}>
          <Input
            className={styles.DeleteInput}
            required
            placeholder="I want to delete my wallet"
            onChange={(e) => {
              e.target.setCustomValidity("");
              if (
                e.target.value.toLowerCase() != "i want to delete my wallet"
              ) {
                e.target.setCustomValidity(
                  "Please type “I want to delete my wallet”."
                );
              }
            }}
          />
          <div className={styles.deleteButtonCnt}>
            <Link href={"#"}>Cancel</Link>
            <Button type="submit">Delete</Button>
          </div>
        </Form>
      </HoverDiv>
    </div>
  );
}
