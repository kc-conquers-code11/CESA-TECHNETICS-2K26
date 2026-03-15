export const LOGO_PUZZLES = {
  easy: [
    {
      name: "Python",
      svg: "🐍",
      options: ["Python", "Ruby", "Perl", "Cobra"],
      blur: 2,
    },
    {
      name: "Docker",
      svg: "🐳",
      options: ["Docker", "Kubernetes", "Vagrant", "VMware"],
      blur: 2,
    },
    {
      name: "Git",
      svg: "🔀",
      options: ["Git", "SVN", "Mercurial", "Bitbucket"],
      blur: 2,
    },
  ],
  medium: [
    {
      name: "Linux",
      svg: "🐧",
      options: ["Linux", "Unix", "BSD", "macOS"],
      blur: 5,
    },
    {
      name: "React",
      svg: "⚛️",
      options: ["React", "Vue", "Angular", "Svelte"],
      blur: 5,
    },
    {
      name: "MongoDB",
      svg: "🍃",
      options: ["MongoDB", "MySQL", "PostgreSQL", "Redis"],
      blur: 5,
    },
  ],
  hard: [
    {
      name: "Kubernetes",
      svg: "☸️",
      options: ["Kubernetes", "Docker Swarm", "Nomad", "Mesos"],
      blur: 10,
    },
    {
      name: "GraphQL",
      svg: "◈",
      options: ["GraphQL", "REST", "gRPC", "SOAP"],
      blur: 10,
    },
    {
      name: "Redis",
      svg: "🔴",
      options: ["Redis", "Memcached", "Cassandra", "Hazelcast"],
      blur: 10,
    },
  ],
} as const;
