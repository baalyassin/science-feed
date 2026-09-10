import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SearchBar } from "@/components/SearchBar";

export default async function SearchPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return <SearchBar />;
}
