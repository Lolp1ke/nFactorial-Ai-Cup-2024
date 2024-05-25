import { RedirectType, redirect } from "next/navigation";

export default function page({
	searchParams,
}: {
	searchParams?: { user: string[]; ai: string[] };
}) {
	let query: string = "?";

	for (const message of searchParams?.user ?? []) {
		query += `user=${[message]}&`;
	}
	for (const message of searchParams?.ai ?? []) {
		query += `ai=${message}&`;
	}

	return redirect(`/pdf${query}`, RedirectType.replace);
}
