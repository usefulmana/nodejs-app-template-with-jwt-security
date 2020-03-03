const express = require('express');
const app = express();
const PORT = 3000 || process.env.PORT;
const cors = require('cors');
const authRoute = require("./routes/auth")

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log(`${new Date().toString()} = ${req.originalUrl}`, req.body);
    next();
});
app.use(authRoute);

// Static page for wrong address
// app.use(express.static('public'));

// app.use((req, res, next) => {
//     res.status(404).send('We think you are lost');
// });
// app.use((err, req, res, next) => {
//     console.log(err.stack);
//     res.sendFile(path.join(__dirname, '../public/500.html'));
// });


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})