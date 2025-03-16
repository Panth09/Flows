// Mock backend for testing - REMOVE IN PRODUCTION
if (!window.backendMockEnabled) {
    window.backendMockEnabled = true;
    
    // Create a mock user database - Making sure it's defined correctly
    window.mockUserDB = [
        {
            id: 1,
            username: 'admin',
            password: 'password',
            name: 'Admin User',
            role: 'administrator',
            department: 'IT'
        },
        {
            id: 2,
            username: 'user1',
            password: 'password1',
            name: 'John Doe',
            role: 'standard',
            department: 'Sales'
        },
        {
            id: 3,
            username: 'user2',
            password: 'password2',
            name: 'Jane Smith',
            role: 'manager',
            department: 'Marketing'
        },
        {
            id: 4,
            username: 'user3',
            password: 'password3',
            name: 'Robert Johnson',
            role: 'standard',
            department: 'Finance'
        },
        {
            id: 5,
            username: 'user4',
            password: 'password4',
            name: 'Emily Davis',
            role: 'manager',
            department: 'HR'
        },
        {
            id: 6,
            username: 'user5',
            password: 'password5',
            name: 'Michael Wilson',
            role: 'standard',
            department: 'Operations'
        }
    ];
    
    // Function to add a new user to the mock database
    window.addMockUser = function(username, password, name, role, department) {
        const newId = window.mockUserDB.length > 0 ? 
            Math.max(...window.mockUserDB.map(user => user.id)) + 1 : 1;
            
        const newUser = {
            id: newId,
            username,
            password,
            name,
            role,
            department
        };
        
        window.mockUserDB.push(newUser);
        console.log(`Added new user: ${username} (${name})`);
        return newUser;
    };
    
    // Function to list all mock users (passwords hidden for security)
    window.listMockUsers = function() {
        return window.mockUserDB.map(user => ({
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            department: user.department
        }));
    };
    
    // Override fetch for specific URLs
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        console.log('Intercepted fetch to:', url);
        
        // Handle login requests
        if (url.includes('/api/auth/login')) {
            return new Promise((resolve) => {
                console.log('Mock backend processing login request');
                
                try {
                    // Get the request body
                    const body = JSON.parse(options.body);
                    const { username, password } = body;
                    
                    console.log(`Login attempt for: ${username}`);
                    
                    // Debug: Log all available users
                    console.log('Available users:', window.mockUserDB.map(u => u.username));
                    
                    // Find user in our mock database
                    const user = window.mockUserDB.find(u => 
                     u.username === username && u.password === password);
                    localStorage.setItem('isLoggedIn', 'true'); 
                    console.log('Found user?', !!user);

                    // Simulate network delay
                    setTimeout(() => {
                        if (user) {
                            console.log('Login successful for', username);
                            // Create a sanitized user object (without password)
                            const safeUser = { ...user };
                            delete safeUser.password;
                            
                            resolve({
                                ok: true,
                                status: 200,
                                json: async () => ({
                                    success: true,
                                    message: 'Login successful',
                                    token: `mock-jwt-token-${user.id}-${Date.now()}`,
                                    user: safeUser
                                })
                            });
                        } else {
                            console.log('Login failed for', username);
                            resolve({
                                ok: false,
                                status: 401,
                                json: async () => ({
                                    success: false,
                                    message: 'Invalid username or password'
                                })
                            });
                        }
                    }, 800);
                } catch (error) { 
                    console.error('Error processing login:', error);
                    resolve({ 
                        ok: false,
                        status: 400,
                        json: async () => ({
                            success: false,
                            message: 'Bad request'
                        })
                    });
                }
            });
        }
        
        // For all other requests, use the original fetch
        return originalFetch(url, options);
    };
    
    // Print user credentials to check if they're available
    console.log('Mock backend enabled with multiple users:');
    window.mockUserDB.forEach(user => {
        console.log(`- ${user.username}/${user.password} (${user.role})`);
    });
    console.log('Use window.addMockUser() to add more users');
    console.log('Use window.listMockUsers() to view all users');
}