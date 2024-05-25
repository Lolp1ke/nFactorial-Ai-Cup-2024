"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	console.log(error);

	return (
		<Card className={"flex flex-col flex-1 items-center justify-center gap-3"}>
			<CardHeader>
				<CardTitle>Error occured</CardTitle>
				<CardDescription>{error.message}</CardDescription>
			</CardHeader>
			<CardFooter>
				<Button type={"button"} onClick={reset}>
					Reset
				</Button>
			</CardFooter>
		</Card>
	);
}
