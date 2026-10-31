import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("brightloop_session")?.value;

  // If user has a session, redirect to dashboard
  // Otherwise redirect to login
  if (token) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
