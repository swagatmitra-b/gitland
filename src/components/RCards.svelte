<script lang="ts">
  import { onDestroy } from "svelte";
  import { GithubData } from "../stores/Store";
  import Icon from "@iconify/svelte";
  import type { Unsubscriber } from "svelte/motion";
  import { fade } from "svelte/transition";
  import { type RepoData, type savedRepo } from "../lib/types";

  let fetched: RepoData[] | null = null;
  let notFound = false;
  let loading = true;
  const unsub: Unsubscriber = GithubData.subscribe((data) => {
    if (data) {
      let parsed = JSON.parse(data);
      if (!parsed.message) {
        notFound = false;
        fetched = parsed.items;
        return;
      }
      fetched = null;
      notFound = true;
    }
  });

  onDestroy(() => {
    if (unsub) unsub();
  });

  function isoToLocalString(isoString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", options);
  }

  const storedData = localStorage.getItem("repos");

  let saves: savedRepo[] = storedData ? JSON.parse(storedData) : [];

  function saveRepo(
    name: string,
    url: string,
    description: string,
    avatar: string,
    language: string
  ) {
    saves.push({
      name,
      url,
      description,
      avatar,
      language,
    });
    saves = saves;
    localStorage.setItem("repos", JSON.stringify(saves));
  }
</script>

{#if fetched}
  <div class="repos">
    {#each fetched as repo (repo.id)}
      <div class="card" transition:fade={{ duration: 250, delay: 100 }}>
        <div class="head">
          <a href={repo.svn_url} target="_blank">{repo.full_name}</a>
          <img
            loading="lazy"
            src={repo.owner.avatar_url}
            alt="avatar"
            class={loading ? "blur" : ""}
            on:load={() => (loading = false)}
          />
        </div>
        <div class="">
          <h5>
            {repo.description
              ? repo.description.slice(0, 150)
              : "No description"}
          </h5>
          <h5>
            Language: {repo.language == null
              ? "Github Markdown"
              : repo.language}
          </h5>
        </div>
        <div class="inner">
          <span>
            <Icon
              icon="fa-solid:star"
              style="font-size: 2rem"
            />{repo.stargazers_count}
          </span>
          <span>
            <Icon icon="ph:git-fork-bold" style="font-size: 2rem" />
            {repo.forks}
          </span>
          <span>
            <Icon
              icon="ant-design:issues-close-outlined"
              style="font-size: 2rem"
            />{repo.open_issues}
          </span>
        </div>
        <div class="">
          <h5>Created at: {isoToLocalString(repo.created_at)}</h5>
          <h5>Last Updated: {isoToLocalString(repo.updated_at)}</h5>
        </div>
        <button
          disabled={saves && saves.find((saved) => saved.name == repo.full_name)
            ? true
            : false}
          on:click={() =>
            saveRepo(
              repo.full_name,
              repo.svn_url,
              repo.description,
              repo.owner.avatar_url,
              repo.language
            )}
          >{saves && saves.find((saved) => saved.name == repo.full_name)
            ? "Saved"
            : "Save"}</button
        >
      </div>
    {/each}
  </div>
{/if}

<div class="notfound">
  {#if notFound}
    <h5>User not found :(</h5>
  {/if}
</div>

<style>
  .repos {
    font-family: "Roboto";
    margin: 3rem;
    display: grid;
    padding: 0rem 2rem;
    max-width: 100%;
    grid-template-columns: repeat(5, 16rem);
    gap: 1rem;
  }
  a {
    word-break: break-all;
  }
  span {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
  }
  .head {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .card {
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: aliceblue;
    padding: 1.4rem;
    width: 15.5rem;
    border-radius: 2rem;
    border: 2px solid black;
  }
  img {
    width: 8rem;
    height: 8rem;
    border-radius: 0.8rem;
    margin-top: 0.5rem;
  }
  .inner {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  button {
    padding: 0.5rem 1rem;
    border-radius: 7px;
    cursor: pointer;
  }

  @media screen and (max-width: 414px) {
    .repos {
      display: flex;
      flex-direction: column;
    }
  }
</style>
