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
import { RedirectType, redirect } from "next/navigation";
import { cookies } from "next/headers";
import Axios from "@/lib/axios";

export default async function page() {
	if (cookies().get("name")) return redirect("/pdf", RedirectType.push);

	return (
		<form
			action={async (formData: FormData) => {
				"use server";
				const name: string | undefined = formData
					.get("name")
					?.toString()
					.toLocaleLowerCase()
					.replace(/\s\t\n\r /g, "-");
				if (!name) return alert("name not found");

				await Axios({
					url: "/create/" + name,
					method: "POST",
				}).then(() => {
					cookies().set("name", name);
				});
			}}
			className={"flex flex-1 items-center justify-center "}
		>
			<Card className={"w-full max-w-[350px]"}>
				<CardHeader>
					<CardTitle>Welcome</CardTitle>
					<CardDescription>TODO: Some description text</CardDescription>
				</CardHeader>
				<CardContent>
					<Input
						name={"name"}
						id={"name"}
						type={"text"}
						placeholder={"Enter your name"}
					/>
				</CardContent>
				<CardFooter>
					<Button type={"submit"}>Enter</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
