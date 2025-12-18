"use client";

export default function TestChat() {
  const testAPI = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello, test message' }]
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));
      
      const text = await response.text();
      console.log('Response body:', text);
      
      return { status: response.status, body: text };
    } catch (error) {
      console.error('Test error:', error);
      return { error: String(error) };
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat API Test</h1>
      <button 
        onClick={async () => {
          const result = await testAPI();
          alert(JSON.stringify(result, null, 2));
        }}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Test Chat API
      </button>
      <p>Check browser console for detailed logs</p>
    </div>
  );
}
