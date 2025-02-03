import { getAuth, signOut } from "firebase/auth"
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { Button } from "@nextui-org/react";

export default function SignOut() {
  const auth = getAuth();
  const router = useRouter();

  const handleSubmit = () => {
    signOut(auth).then(() => {
      router.push("/login");
    }).catch((error) => {
      console.log(error.message)
    }
    )
  }


  return (
    <Button
      onClick={handleSubmit}
      color="primary" href="/signup" variant="flat"
      className={styles.button}>
      ログアウト
    </Button>
  )
}