// Test Event Execution functionality
const testEventExecution = async () => {
  try {
    // First login to get token
    const loginResponse = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'sejal@gmail.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful, got token');
    
    // Test creating event execution
    const executionData = {
      bookingId: '6963ca223dd7e0874c316d24', // Latest booking ID
      staffAssigned: [],
      notes: 'Test event execution'
    };
    
    console.log('📡 Creating event execution:', executionData);
    
    const createResponse = await fetch('http://localhost:5000/api/v1/event-executions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(executionData)
    });
    
    console.log('📡 Create response:', createResponse.status);
    const createResult = await createResponse.json();
    console.log('📄 Create result:', createResult);
    
    if (createResponse.ok) {
      console.log('✅ Event execution created successfully!');
      
      // Test marking as completed
      const executionId = createResult.data._id;
      console.log('📡 Marking event as completed...');
      
      const completeResponse = await fetch(`http://localhost:5000/api/v1/event-executions/${executionId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completionNotes: 'Event completed successfully'
        })
      });
      
      console.log('📡 Complete response:', completeResponse.status);
      const completeResult = await completeResponse.json();
      console.log('📄 Complete result:', completeResult);
      
      if (completeResponse.ok) {
        console.log('✅ Event marked as completed successfully!');
        
        // Test uploading deliverable
        console.log('📡 Uploading deliverable...');
        
        const deliverableData = {
          name: 'Event Photos',
          description: 'Professional event photography',
          fileUrl: 'https://example.com/photos.zip',
          fileType: 'zip',
          fileSize: 1024000
        };
        
        const uploadResponse = await fetch(`http://localhost:5000/api/v1/event-executions/${executionId}/deliverables`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(deliverableData)
        });
        
        console.log('📡 Upload response:', uploadResponse.status);
        const uploadResult = await uploadResponse.json();
        console.log('📄 Upload result:', uploadResult);
        
        if (uploadResponse.ok) {
          console.log('✅ Deliverable uploaded successfully!');
          
          // Test verifying deliverable
          const deliverableId = uploadResult.data.deliverables[uploadResult.data.deliverables.length - 1]._id;
          console.log('📡 Verifying deliverable...');
          
          const verifyResponse = await fetch(`http://localhost:5000/api/v1/event-executions/${executionId}/deliverables/${deliverableId}/verify`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              verificationNotes: 'Deliverable verified successfully'
            })
          });
          
          console.log('📡 Verify response:', verifyResponse.status);
          const verifyResult = await verifyResponse.json();
          console.log('📄 Verify result:', verifyResult);
          
          if (verifyResponse.ok) {
            console.log('✅ Deliverable verified successfully!');
            
            // Test submitting client feedback
            console.log('📡 Submitting client feedback...');
            
            const feedbackData = {
              rating: 5,
              comments: 'Excellent service! Would definitely recommend.',
              wouldRecommend: true,
              suggestions: 'None, everything was perfect!'
            };
            
            const feedbackResponse = await fetch(`http://localhost:5000/api/v1/event-executions/${executionId}/feedback`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(feedbackData)
            });
            
            console.log('📡 Feedback response:', feedbackResponse.status);
            const feedbackResult = await feedbackResponse.json();
            console.log('📄 Feedback result:', feedbackResult);
            
            if (feedbackResponse.ok) {
              console.log('✅ Client feedback submitted successfully!');
              console.log('🎉 All Event Execution features working perfectly!');
            } else {
              console.log('❌ Feedback submission failed:', feedbackResult.error);
            }
          } else {
            console.log('❌ Deliverable verification failed:', verifyResult.error);
          }
        } else {
          console.log('❌ Deliverable upload failed:', uploadResult.error);
        }
      } else {
        console.log('❌ Event completion failed:', completeResult.error);
      }
    } else {
      console.log('❌ Event execution creation failed:', createResult.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testEventExecution();
