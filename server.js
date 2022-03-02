const express = require("express");

const app = express();

//set static folder
app.use(express.static("./public"));

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`);
});
