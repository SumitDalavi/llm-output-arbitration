const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:4000/api/v1/arbitrate', {
      originalPrompt: "If I have 3 apples and eat 1, then buy 5 more, how many do I have?",
      originalOutput: "You have 6 apples. 3 - 1 = 2, 2 + 5 = 7. Therefore you have 6 apples."
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (e) {
    console.error(e?.response?.data || e.message);
  }
}

test();
