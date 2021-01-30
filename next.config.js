module.exports = {
  // Force ignore fs client-side
  webpack: (config, { isServer }) => {
    // Check if server
    if (!isServer) {
      // If server
      config.node = {
        // Ignore fs
        fs: "empty",
      };
    }

    // Return modified config
    return config;
  },
};
