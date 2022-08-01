const express = require("express")
require("dotenv").config()
const port = process.env.PORT || 5000
const { graphqlHTTP } = require("express-graphql")
const colors = require("colors")
const connectDB = require("./config/db")
const app = express()
const cors = require("cors")

// Connect to MongoDB
connectDB()

app.use(cors())
app.use("/graphql", graphqlHTTP({
  schema: require("./schema/schema"),
  graphiql: process.env.NODE_ENV === "development" ? true : false
}))



app.listen(port,
  console.log(`Server is running on port ${port}`)
)  