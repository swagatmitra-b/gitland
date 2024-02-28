export interface savedRepo {
  name: string;
  url: string;
  description: string;
  avatar: string;
  language: string;
}

export interface RepoData {
  id: number;
  full_name: string;
  created_at: string;
  updated_at: string;
  description: string;
  forks: number;
  open_issues: number;
  svn_url: string;
  language: string;
  stargazers_count: number;
  owner: { avatar_url: string };
}

export interface CardData {
  [key: string]: string | number;
  created_at: string;
  updated_at: string;
  html_url: string;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
}
