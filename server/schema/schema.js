const { GraphQLObjectType,
  GraphQLID,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType } = require("graphql")

// Mongoose Models
const Project = require("../models/Project")
const Client = require("../models/Client")



// Client Type
const ClientType = new GraphQLObjectType({
  name: "client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  })
})

// Client Type
const ProjectType = new GraphQLObjectType({
  name: "project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    clientId: { type: GraphQLID },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId)
      }

    }
  })
})



const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    clients: {
      type: new GraphQLList(ClientType),
      resolve() {
        return Client.find()
      }
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, args) {
        return Client.findById(args.id)
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        return Project.find()
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, args) {
        return Project.findById(args.id)
      }
    }
  }
})

// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { name, email, phone }) {
        return new Client({ name, email, phone }).save()
      },
    },
    // Delete a client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, { id }) {
        Project.find({ clientId: id }).then((projects) => {
          projects.forEach(project => {
            project.remove()
          })
        })
        return Client.findByIdAndRemove(id)
      }
    },
    // Create a project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              "new": { value: "Not Started" },
              "progress": { value: "In Progress" },
              "completed": { value: "Completed" }
            }
          }),
          defaultValue: "Not Started"
        },
        clientId: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve(parentValue, { name, description, status, clientId }) {
        return new Project({ name, description, status, clientId }).save()
      }

    },
    // Delete a project
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, { id }) {
        return Project.findByIdAndRemove(id)
      }
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              "new": { value: "Not Started" },
              "progress": { value: "In Progress" },
              "completed": { value: "Completed" }
            }
          }),
        },
      },
      resolve(parentValue, { id, name, description, status }) {
        return Project.findByIdAndUpdate(id, {
          $set: {
            name,
            description,
            status,
          }
        }, { new: true })
      }

    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})