import { RedirectType, redirect } from "next/navigation";

export default function page() {
	return redirect("/home", RedirectType.push);
}
