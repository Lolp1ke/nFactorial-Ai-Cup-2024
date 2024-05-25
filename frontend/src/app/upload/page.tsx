import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Axios from "@/lib/axios";
import axios from "axios";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

export default async function page() {
	const id: string | undefined = cookies().get("name")?.value;
	if (!id) return redirect("/home");

	const data = await Axios({
		url: "check/" + id,
		method: "GET",
	}).catch(() => {
		return;
	});

	if (data) {
		return redirect("/pdf", RedirectType.push);
	}

	return (
		<form
			className={"flex flex-1 items-center justify-center w-full"}
			action={async (formData: FormData) => {
				"use server";
				const file: File = formData.get("file") as File;
				if (!file) return;

				await Axios({
					url: "/upload/" + id,
					method: "POST",
					headers: {
						Accept: "*/*",
						"Content-Type": "multipart/form-data",
					},
					data: formData,
				}).then(() => {
					return redirect("/pdf", RedirectType.push);
				});
			}}
		>
			<Card className={"flex flex-col gap-3 max-w-[350px]"}>
				<CardHeader>
					<CardTitle>Upload context file first</CardTitle>
					<CardDescription>
						Get a super precise answer to any question based on the uploaded
						PDFs!
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Input
						name={"file"}
						id={"file"}
						type={"file"}
						accept={"application/pdf"}
					/>
				</CardContent>
				<CardFooter>
					<Button type={"submit"}>Upload</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
