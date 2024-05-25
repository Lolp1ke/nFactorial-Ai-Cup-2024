import axios, { type AxiosRequestConfig } from "axios";

export default function Axios(config: AxiosRequestConfig) {
	return axios({
		baseURL: process.env.BACKEND_PREFIX,
		...config,
	});
}
