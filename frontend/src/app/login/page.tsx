import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
    const cookieStore = await cookies(); 
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return redirect("/register");

  return <h1>Welcome to your Login!</h1>;
}
