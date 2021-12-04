var express = require("express");
require('dotenv').config()
var app = express();
var cors = require("cors");
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.listen(process.env.PORT || 3000, function () {
  console.log("CORS-enabled web server listening on port 3000");
});

app.post("/", function (req, res, next) {
    console.log(req.headers.origin,process.env.CLIENT_URL);
  if(req.headers.origin.indexOf(process.env.CLIENT_URL) === -1){
      throw new Error("CORS error");
  }
  try {
    const js = req.body;
    var axios = require("axios");
    var data = JSON.stringify({
      prompt: `${js.code}\n\"\"\"\nThe time complexity of this function is`,
      temperature: 0,
      max_tokens: 164,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\n"],
    });

    var config = {
      method: "post",
      url: "https://api.openai.com/v1/engines/davinci/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${process.env.OPENAI_TOKEN}`,
      },
      data: data,
    };
    axios(config).then(function (response) {
      console.log(JSON.stringify(response.data));
      res.json(response.data);
    });
  } catch (error) {
    console.log(error);
    throw new Error("request failed");
  }
});
