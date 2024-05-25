import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Axios from "@/lib/axios";
import { SendIcon, TrashIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { RedirectType, redirect } from "next/navigation";
import Chat from "./chat";

export default async function page({
	searchParams,
}: {
	searchParams?: { user: string[]; ai: string[] };
}) {
	const id: string | undefined = cookies().get("name")?.value;
	if (!id) return redirect("/home");

	if (Object.keys(searchParams ?? {}).length == 0) {
		searchParams = {
			ai: ["Github: @lolp1ke"],
			user: ["Credits:"],
		};
	}

	const data = await Axios({
		url: `/check/${id}`,
		method: "GET",
	}).catch(() => {
		return redirect("/upload", RedirectType.push);
	});

	return (
		<form
			className={"flex flex-col flex-1 p-4 gap-6"}
			action={async (formData: FormData) => {
				"use server";
				let prompt: string | undefined = formData.get("question")?.toString();
				if (!prompt) return;

				let query: string = "?";

				for (const message of searchParams?.user ?? []) {
					console.log(message);

					query += `user=${[message]}&`;
				}
				for (const message of searchParams?.ai ?? []) {
					query += `ai=${message}&`;
				}

				console.log(query);

				await Axios({
					url: `/prompt/${id}`,
					method: "POST",
					data: {
						prompt,
					},
				}).then((response) => {
					response.data = response.data.replace(/\s\t\n\r /g, "_");
					prompt = prompt!.replace(/\s\t\n\r /g, "_");

					query += `user=${prompt}&ai=${response.data}&`;

					return redirect(`/redirect	${query}`, RedirectType.push);
				});
			}}
		>
			<Chat />
			<div className={"flex w-full gap-3 fixed bottom-[20px]"}>
				<div className={"flex gap-2 w-full"}>
					<Input
						name={"question"}
						id={"question"}
						type={"text"}
						autoComplete={"off"}
						placeholder={"Enter your question"}
					/>
					<Button
						className={"flex gap-1 items-center"}
						type={"submit"}
						variant={"outline"}
					>
						<SendIcon />
						<p>Send</p>
					</Button>
				</div>
				<Button
					className={"flex gap-1 items-center"}
					type={"button"}
					variant={"secondary"}
				>
					<TrashIcon />
					<Link
						href={{
							pathname: "/clear",
						}}
					>
						Clear data
					</Link>
				</Button>
			</div>
		</form>
	);
}
