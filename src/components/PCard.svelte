<script lang="ts">
  import { onDestroy } from "svelte";
  import { GithubData } from "../stores/Store";
  import type { Unsubscriber } from "svelte/motion";
  import { fade } from "svelte/transition";
  import {
    type CardData,
    type RepoData,
    type savedProfile,
  } from "../lib/types";
  import PrCards from "./PRCards.svelte";

  let userData: CardData | null = null;
  let repoData: RepoData[] | null = null;
  let notFound = false;
  let loading = true;

  $: storedData = localStorage.getItem("profiles");

  let saves: savedProfile[] = storedData ? JSON.parse(storedData) : [];

  function saveProfile(name: string, url: string, avatar: string, bio: string) {
    saves.push({
      name,
      url,
      avatar,
      bio,
    });
    saves = saves;
    localStorage.setItem("profiles", JSON.stringify(saves));
  }

  const unsub: Unsubscriber = GithubData.subscribe((data) => {
    if (data) {
      let [user, repo] = JSON.parse(data);
      if (!user.message) {
        notFound = false;
        userData = user;
        repoData = repo;
        return;
      }
      userData = null;
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
</script>

{#if userData && repoData}
  <h2 id="name">{userData.name == null ? "" : userData.name}</h2>
  <div class="card" transition:fade={{ duration: 250, delay: 100 }}>
    <div class="inner">
      <div class="image">
        <img
          loading="lazy"
          src={userData.avatar_url}
          alt="avatar"
          class={loading ? "blur" : ""}
          on:load={() => (loading = false)}
        />
      </div>
      <div class="rest">
        <h2>Username: {userData.login}</h2>
        <h2>
          Location: {userData.location == null
            ? "Not available"
            : userData.location}
        </h2>
        <h2>
          Github Profile: <a href={userData.html_url} target="_blank">Link</a>
        </h2>
        <h2>Bio: {userData.bio == null ? "None" : userData.bio}</h2>
        <h2>Created At: {isoToLocalString(userData.created_at)}</h2>
        <h2>Last Updated: {isoToLocalString(userData.updated_at)}</h2>
        <button
          disabled={saves && saves.find((saved) => saved.name == userData.name)
            ? true
            : false}
          on:click={() =>
            saveProfile(
              userData.name,
              userData.html_url,
              userData.avatar_url,
              userData.bio
            )}>Save</button
        >
        <div class="stats">
          <h2>
            Public Repos <span>{userData.public_repos}</span>
          </h2>
          <h2>
            Followers<span>{userData.followers}</span>
          </h2>
          <h2>
            Following <span>{userData.following}</span>
          </h2>
        </div>
      </div>
    </div>
  </div>
  <PrCards
    repoData={repoData.sort((a, b) => b.stargazers_count - a.stargazers_count)}
  />
{/if}
<div class="notfound">
  {#if notFound}
    <h2>User not found :(</h2>
  {/if}
</div>

<style>
  .card {
    z-index: 2;
    display: flex;
    flex-direction: column;
    background-color: aliceblue;
    padding: 1.4rem;
    border-radius: 2rem;
    border: 2px solid black;
    box-shadow: 1px 1px 0.1rem;
    line-height: 1.2rem;
  }
  img {
    width: 20rem;
    height: 20rem;
    border-radius: 0.8rem;
  }
  h2 {
    font-family: "Roboto";
    font-weight: 400;
    font-size: 1.2rem;
  }
  .inner,
  .stats {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
  }
  .inner {
    gap: 2rem;
  }
  .stats h2 {
    display: flex;
    flex-direction: column;
    font-size: 1.2rem;
    text-align: center;
  }
  .stats {
    border: 1px solid black;
    background-color: lightblue;
    padding: 0.4rem 2rem;
    border-radius: 1rem;
  }
  .rest {
    max-width: 25rem;
  }
  #name {
    font-size: 1.7rem;
    font-weight: bold;
  }
  span {
    margin-top: 0.5rem;
  }

  .notfound h2 {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .blur {
    filter: blur(0.7rem);
  }

  button {
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 7px;
    cursor: pointer;
  }

  @media screen and (max-width: 414px) {
    img,
    .card {
      width: 19rem;
    }
    .inner {
      flex-direction: column;
      text-align: center;
    }
    .rest {
      margin-top: -1rem;
    }
    span {
      margin-top: 0.5rem;
    }
  }
</style>
