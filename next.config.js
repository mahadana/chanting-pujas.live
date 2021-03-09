module.exports = {
  async rewrites() {
    return [
      {
        source: "/chants/:id",
        destination: "/api/chants/:id",
      },
      {
        source: "/chants.json",
        destination: "/api/chants.json",
      },
      {
        source: "/timing/:id",
        destination: "/api/timing/:id",
      },
      {
        source: "/timing.json",
        destination: "/api/timing.json",
      },
      {
        source: "/toc.json",
        destination: "/api/toc.json",
      },
    ];
  },
};
