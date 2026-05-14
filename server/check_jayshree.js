const axios = require('axios');
axios.get('http://localhost:5000/api/submissions')
  .then(res => {
    const s = res.data.find(sub => 
      (sub.userId && sub.userId.toLowerCase().includes('usr004')) || 
      (sub.orderId && sub.orderId.toLowerCase().includes('usr004')) ||
      (sub.userId && sub.userId.toLowerCase().includes('jayshree'))
    );
    if (s) {
      console.log("FOUND SUBMISSION FOR JAYSHREE:", s);
    } else {
      console.log("NOT FOUND JAYSHREE SUBMISSION in", res.data.length, "submissions");
      console.log("ALL SUBMISSION IDs:", res.data.map(d => ({ userId: d.userId, orderId: d.orderId, ngoId: d.ngoId })));
    }
  })
  .catch(e => console.error(e.message));
