import { app } from "./app";
require('dotenv').config();



// create a server
app.listen(process.env.PORT, () => {
    console.log(`Server is connected to ${process.env.PORT}`);

}); 