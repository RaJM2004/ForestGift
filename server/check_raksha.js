const axios = require('axios');
axios.get('http://localhost:5000/api/submissions')
  .then(res => {
    const s = res.data.find(sub => sub.userId === 'USR003' || sub.orderId === 'TKN-2026-0003');
    if (s) {
      console.log("FOUND SUBMISSION:", s);
    } else {
      console.log("NOT FOUND USR003 in", res.data.length, "submissions");
      console.log("ALL IDs:", res.data.map(d => d.userId || d.orderId));
    }
  })
  .catch(e => console.error(e.message));
