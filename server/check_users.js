const axios = require('axios');
axios.get('http://localhost:5000/api/users')
  .then(res => {
    console.log("USERS IN DB:", res.data.map(u => ({ id: u.id, name: u.name, token: u.token })));
    console.log("TOTAL USERS:", res.data.length);
  })
  .catch(e => console.error(e.message));
