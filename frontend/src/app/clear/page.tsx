import Axios from "@/lib/axios";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

export default async function page() {
	const id: string | undefined = cookies().get("name")?.value;
	if (!id) return redirect("/home");

	await Axios({
		url: "/clear/" + id,
		method: "POST",
	});

	return redirect("/upload", RedirectType.push);
}
