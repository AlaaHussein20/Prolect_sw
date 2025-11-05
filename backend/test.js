const axios = require('axios');

// Test data
const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "test123",
    role: "patient"
};

// Check if server is running
async function checkServer() {
    try {
        const response = await axios.get('http://localhost:5000');
        console.log('✅ Server Test:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Server Test Failed:', error.message);
        console.error('Make sure the backend server is running on port 5000');
        return false;
    }
}

// Test registration
async function testRegistration() {
    console.log('\n📝 Testing Registration...');
    try {
        const response = await axios.post('http://localhost:5000/api/users/register', testUser);
        console.log('✅ Registration Test:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('❌ Registration Test Failed:', error.response.data);
            console.error('Status:', error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('❌ Registration Test Failed: No response received');
        } else {
            // Something happened in setting up the request
            console.error('❌ Registration Test Failed:', error.message);
        }
    }
}

// Test login
async function testLogin() {
    console.log('\n🔑 Testing Login...');
    try {
        const response = await axios.post('http://localhost:5000/api/users/login', {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ Login Test:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('❌ Login Test Failed:', error.response.data);
            console.error('Status:', error.response.status);
        } else if (error.request) {
            console.error('❌ Login Test Failed: No response received');
        } else {
            console.error('❌ Login Test Failed:', error.message);
        }
    }
}

// Run tests
async function runTests() {
    console.log('🔄 Starting API tests...');
    
    // First check if server is running
    const serverRunning = await checkServer();
    if (!serverRunning) {
        console.log('❌ Tests aborted: Server not running');
        return;
    }

    // Run registration test
    await testRegistration();

    // Wait a bit before login test
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Run login test
    await testLogin();
    
    console.log('\n✨ Tests completed');
}

runTests();