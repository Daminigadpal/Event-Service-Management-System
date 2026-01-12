// Test the new unprotected users endpoint
const testUnprotectedUsers = async () => {
  console.log('🔍 Testing /api/v1/users/all endpoint (unprotected)...');
  
  try {
    const response = await fetch('http://localhost:5000/api/v1/users/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Response Status:', response.status);
    console.log('📡 Response Headers:', response.headers);
    
    const text = await response.text();
    console.log('📄 Raw Response (first 200 chars):', text.substring(0, 200));
    
    if (response.ok) {
      try {
        const data = JSON.parse(text);
        console.log('✅ Parsed JSON response:', data);
        if (data.success && data.data) {
          console.log('👥 Users found:', data.data.length);
          data.data.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.name} - ${user.email} (${user.role})`);
          });
        } else {
          console.log('❌ JSON response indicates failure:', data);
        }
      } catch (parseError) {
        console.log('❌ Failed to parse JSON:', parseError.message);
      }
    } else {
      console.log('❌ HTTP Error:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

testUnprotectedUsers();
