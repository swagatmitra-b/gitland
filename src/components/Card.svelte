<script lang="ts">
  import { onDestroy } from "svelte";
  import GithubData from "../stores/Store";
  import type { Unsubscriber } from "svelte/motion";
  import { fade } from "svelte/transition";

  interface CardData {
    [key: string]: string | number;
    created_at: string;
    updated_at: string;
    html_url: string;
    avatar_url: string;
    followers: number;
    following: number;
    public_repos: number;
  }

  let fetched: CardData | null = null;
  let notFound: boolean = false;

  const unsub: Unsubscriber = GithubData.subscribe((data) => {
    if (data) {
      let parsed = JSON.parse(data);
      if (!parsed.message) {
        notFound = false;
        fetched = parsed;
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
</script>

{#if fetched}
  <h2 id="name">{fetched.name == null ? '' : fetched.name}</h2>
  <div class="card" transition:fade={{ duration: 250, delay: 100 }}>
    <div class="inner">
      <div class="image">
        <img loading="lazy" src={fetched.avatar_url} alt="avatar" />
      </div>
      <div class="rest">
        <h2>Username: {fetched.login}</h2>
        <h2>Location: {fetched.location == null ? 'Not available' : fetched.location}</h2>
        <h2>
          Github Profile: <a href={fetched.html_url} target="_blank">Link</a>
        </h2>
        <h2>Bio: {fetched.bio == null ? "None" : fetched.bio}</h2>
        <h2>Created At: {isoToLocalString(fetched.created_at)}</h2>
        <h2>Last Updated: {isoToLocalString(fetched.updated_at)}</h2>
        <div class="stats">
          <h2>
            Public Repos <span>{fetched.public_repos}</span>
          </h2>
          <h2>
            Followers<span>{fetched.followers}</span>
          </h2>
          <h2>
            Following <span>{fetched.following}</span>
          </h2>
        </div>
      </div>
    </div>
  </div>
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
    justify-content: space-around;
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

  @media screen and (max-width: 414px) {
    .card {
      width: 20rem;
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
