import { getCurrentUser } from "@/lib/actions/auth-actions";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const user = await getCurrentUser();

  return <HeaderClient user={user} />;
}
