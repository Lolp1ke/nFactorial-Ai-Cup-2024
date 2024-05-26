import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Axios from "@/lib/axios";
import { SendIcon, TrashIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { RedirectType, redirect } from "next/navigation";

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

	await Axios({
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
					query += `user=${[message]}&`;
				}
				for (const message of searchParams?.ai ?? []) {
					query += `ai=${message}&`;
				}

				await Axios({
					url: `/prompt/${id}`,
					method: "POST",
					data: {
						prompt,
					},
				}).then((response) => {
					response.data = response.data.replaceAll(/\s\t\n\r /g, "%20");
					prompt = prompt!.replaceAll(/\s\t\n\r /g, "%20");
					console.log(prompt);

					query += `user=${prompt}&ai=${response.data}&`;

					return redirect(`/pdf${query}`, RedirectType.push);
				});
			}}
		>
			<div className={"flex flex-1 flex-col-reverse pb-16"}>
				<div
					className={
						"flex flex-col gap-6 justify-between w-full max-h-full overflow-auto"
					}
				>
					{searchParams!.user.map((_, i) => {
						return (
							<div key={i} className={"flex flex-col gap-4"}>
								<div className={"flex flex-col gap-2 self-end"}>
									<h2 className={"self-end"}>You</h2>
									<p className={"self-end"}>{searchParams?.user[i]}</p>
								</div>
								<div className={"flex flex-col gap-2"}>
									<h2>AI</h2>
									<p>{searchParams?.ai[i]}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<div
				className={
					"flex w-full gap-3 fixed bottom-[20px] left-0 px-4 justify-between"
				}
			>
				<div className={"flex gap-2 w-[90%]"}>
					<Input
						className={"w-full"}
						name={"question"}
						id={"question"}
						type={"text"}
						autoComplete={"off"}
						placeholder={"Enter your question"}
					/>
					<Button
						className={"flex gap-2 items-center"}
						type={"submit"}
						variant={"outline"}
					>
						<SendIcon />
						<p>Send</p>
					</Button>
				</div>
				<Button
					className={"flex gap-2 items-center"}
					type={"button"}
					variant={"secondary"}
				>
					<Link
						className={"flex gap-1"}
						href={{
							pathname: "/clear",
						}}
					>
						<TrashIcon />
						Clear data
					</Link>
				</Button>
			</div>
		</form>
	);
}
