import { writable } from "svelte/store";

type modeType = "users" | "repositories"

const GithubData = writable("");
const Mode = writable<modeType>("repositories")

export { GithubData, Mode, type modeType }