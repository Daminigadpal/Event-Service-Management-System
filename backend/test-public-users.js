// Test the new public users endpoint
const testPublicUsersEndpoint = async () => {
  console.log('🔍 Testing /api/v1/public-users endpoint (unprotected)...');
  
  try {
    const response = await fetch('http://localhost:5000/api/v1/public-users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Response Status:', response.status);
    console.log('📡 Response Headers:', Object.fromEntries(response.headers));
    
    const text = await response.text();
    console.log('📄 Raw Response:', text);
    
    if (response.ok) {
      try {
        const data = JSON.parse(text);
        console.log('✅ Parsed JSON response:', data);
        if (data.success && data.data) {
          console.log('👥 Users found:', data.data.length);
          data.data.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.name} - ${user.email} (${user.role})`);
          });
          return true;
        } else {
          console.log('❌ JSON response indicates failure:', data);
        }
      } catch (parseError) {
        console.log('❌ Failed to parse JSON:', parseError.message);
      }
    } else {
      console.log('❌ HTTP Error:', response.status, response.statusText);
    }
    
    return false;
  } catch (error) {
    console.error('❌ Test error:', error);
    return false;
  }
};

testPublicUsersEndpoint().then(success => {
  if (success) {
    console.log('✅ Public users API endpoint is working - frontend should be able to fetch users');
  } else {
    console.log('❌ Public users API endpoint has issues - need to restart server');
  }
});
