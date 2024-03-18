global.chrome = {
  runtime: {
    lastError: null,
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn()
    }
  },
  cookies: {
    getAll: jest.fn(),
    onChanged: {
      addListener: jest.fn()
    }
  },

};
