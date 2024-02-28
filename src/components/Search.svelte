<script lang="ts">
  import type { ChangeEventHandler } from "svelte/elements";
  import { GithubData, Mode, type modeType } from "../stores/Store";
  let input = "";
  let target = "";
  let url = "";

  Mode.subscribe((currentMode) => (target = currentMode));
  $: if (target == "users")
    url = `https://api.github.com/users/${input};https://api.github.com/users/${input}/repos`;
  else
    url = `https://api.github.com/search/repositories?q=${input}&sort=stars&order=desc&per_page=100`;

  const getInfo = () => {
    if (input == "") return;
    if (target == "users") {
      const [user, repos] = url.split(";");
      Promise.all([fetch(user), fetch(repos)])
        .then((res) => Promise.all(res.map((response) => response.json())))
        .then((data) => {
          GithubData.update((prevData) => (prevData = JSON.stringify(data)));
        })
        .catch((err) => console.log(err.statusCode));
    } else {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          GithubData.update((prevData) => (prevData = JSON.stringify(data)));
        })
        .catch((err) => console.log(err.statusCode));
    }
  };

  const onEnter = (e: KeyboardEvent) => {
    const key = e.key;
    if (key == "Enter") {
      const target = e.target as HTMLInputElement;
      getInfo();
      target.blur();
    }
  };

  const changeMode: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const el = e.target as HTMLOptionElement;
    GithubData.set("");
    Mode.set(el.value as modeType);
  };
</script>

<div class="search">
  <input
    type="text"
    bind:value={input}
    on:keypress={(e) => onEnter(e)}
    placeholder={target == "users" ? "search users" : "search repositories"}
  />
  <button on:click={getInfo} class="">Search</button>
  <select on:change={changeMode}>
    <option value="repositories">repositories</option>
    <option value="users">users</option>
  </select>
</div>

<style>
  .search {
    display: flex;
    gap: 1.2rem;
  }
  input {
    width: 20rem;
    height: 2rem;
    border-radius: 8px;
    padding-left: 1rem;
    font-size: 1rem;
  }
  button {
    padding: 0.59rem;
    border-radius: 0.5rem;
    background-color: transparent;
    border: 1.6px solid black;
    cursor: pointer;
    transition: 0.2s ease-in;
  }

  button:hover {
    background-color: black;
    color: white;
  }

  select {
    border: 1.6px solid black;
    cursor: pointer;
    border-radius: 0.5rem;
    padding: 0rem 0.5rem;
    text-transform: capitalize;
  }

  @media screen and (max-width: 414px) {
    input {
      width: 14rem;
    }
  }
</style>
