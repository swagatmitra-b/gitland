<script lang="ts">
  import GithubData from "../stores/Store";
  let username = "";

  const getInfo = () => {
    if (username == "") return;
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => res.json())
      .then((data) => {
        GithubData.update((prevData) => (prevData = JSON.stringify(data)));
      })
      .catch((err) => console.log(err.statusCode));
  };

  const onEnter = (e: KeyboardEvent) => {
    const key = e.key;
    if (key == "Enter") {
      const target = e.target as HTMLInputElement;
      getInfo();
      target.blur();
    }
  };
</script>

<div class="search">
  <input
    type="text"
    bind:value={username}
    on:keypress={(e) => onEnter(e)}
    placeholder="Enter Username"
  />
  <button on:click={getInfo} class="">SEARCH</button>
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

  @media screen and (max-width: 414px) {
    input {
      width: 14rem;
    }
  }
</style>
