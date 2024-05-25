declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly BACKEND_PREFIX: string;
		}
	}
}

export {};
