global.chrome = {
    runtime: {
        lastError: null,
        onMessage: {
            addListener: jest.fn()
        }
    },
    cookies: {
        getAll: jest.fn(({}, callback) => {
            callback([]); 
        }),
        onChanged: {
            addListener: jest.fn()
        }
    },
    storage: {
        local: {
            get: jest.fn((keys, callback) => {
                const data = {}; 
                keys.forEach((key) => {
                    data[key] = 'mocked-id'; 
                });
                callback(data);
            }),
            set: jest.fn(({}, callback) => {
                callback(); 
            })
        }
    },
    tabs: {
        onUpdated: {
            addListener: jest.fn()
        }
    }
};

