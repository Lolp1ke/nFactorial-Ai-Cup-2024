"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function chat() {
	const searchParams = useSearchParams();
	const [aiMessages, setAiMessages] = useState<string[]>([]);
	const [userMessages, setUserMessages] = useState<string[]>([]);

	useEffect(() => {
		setAiMessages(searchParams.getAll("ai"));
		setUserMessages(searchParams.getAll("user"));
	}, []);

	return (
		<div className={"flex flex-1 flex-col-reverse pb-16"}>
			<div
				className={
					"flex flex-col gap-6 justify-between w-full max-h-full overflow-auto"
				}
			>
				{userMessages.map((_, i) => {
					return (
						<div key={i} className={"flex flex-col gap-4"}>
							<div className={"flex flex-col gap-2 self-end"}>
								<h2 className={"self-end"}>You</h2>
								<p className={"self-end"}>{userMessages[i]}</p>
							</div>
							<div className={"flex flex-col gap-2"}>
								<h2>AI</h2>
								<p>{aiMessages[i]}</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
