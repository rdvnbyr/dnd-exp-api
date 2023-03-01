// graphql schema here
const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Member {
        userId: ID!
        role: String!
        permissions: [String!]!
    }
    input memberInput {
        userId: ID!
        role: String!
        permissions: [String!]!
    }

    type User {
        _id: ID!
        email: String!
        username: String!
        password: String
        avatar: String!
        licence: String!
        role: String!
        createdAt: String!
        updatedAt: String!
        name: String
    }
    input userInput {
        email: String!
        username: String!
        password: String!
        avatar: String
        licence: String
        role: String
        name: String
    }
    input userUpdateInput {
        username: String
        password: String
        avatar: String
        licence: String
        role: String
        name: String
    }

    type Workspace {
        _id: ID!
        name: String!
        description: String
        createdAt: String!
        updatedAt: String!
        owner: User!
    }
    input workspaceInput {
        name: String!
        description: String
        owner: ID!
        boards: [ID!]!
    }
    input workspaceUpdateInput {
        name: String
        description: String
        boards: [ID!]
    }

    type Attachment {
        _id: ID!
        name: String!
        path: String!
        createdAt: String!
        updatedAt: String!
    }
    input attachmentInput {
        name: String!
        path: String!
    }
    input attachmentUpdateInput {
        name: String
        path: String
    }

    type Activity {
        _id: ID!
        comment: String!
        createdAt: String!
        updatedAt: String!
        userId: User!
        attachments: [Attachment!]!
    }
    input activityInput {
        comment: String!
        userId: ID!
        attachments: [ID!]
    }
    input activityUpdateInput {
        comment: String
        attachments: [ID!]
    }

    type Task {
        _id: ID!
        name: String!
        description: String
        createdAt: String!
        updatedAt: String!
        labels: [String!]
        attachments: [Attachment!]
        members: [Member!]
        activities: [Activity!]
    }
    input taskInput {
        name: String!
        description: String
        labels: [String!]
        attachments: [ID!]
        members: [memberInput!]
        activities: [activityInput!]
    }
    input taskUpdateInput {
        name: String
        description: String
        labels: [String!]
        attachments: [ID!]
        members: [memberInput!]
        activities: [activityInput!]
    }

    type List {
        _id: ID!
        name: String!
        tasks: [Task!]!
        members: [Member!]
    }
    input listInput {
        name: String!
        tasks: [taskInput!]
        members: [memberInput!]
    }
    input listUpdateInput {
        name: String
        tasks: [taskInput!]
        members: [memberInput!]
    }

    type Board {
        _id: ID!
        name: String!
        description: String
        createdAt: String!
        updatedAt: String!
        owner: ID!
        workspaceId: ID!
        users: [Member!]!
        lists: [List!]!
    }
    input boardInput {
        name: String!
        description: String
        owner: ID!
        workspaceId: ID!
        users: [memberInput!]!
        lists: [listInput!]!
    }
    input boardUpdateInput {
        name: String
        description: String
        users: [memberInput!]
        lists: [listInput!]
    }

    type Message {
        message: String!
    }

    type AuthData {
        user: User!
        token: String!
    }

    type RootQuery {
        ping: Message!
        login(email: String!, password: String!): AuthData!
        logout: Message!
        getUser: User!
        deleteUser: Message!

        getWorkspaces: [Workspace!]!
        getWorkspace: Workspace!
        deleteWorkspace: Message!

        getBoards: [Board!]!
        getBoard(boardId: ID!): Board!
        deleteBoard(boardId: ID!): Message!

        getLists: [List!]!
        deleteListById(boardId: ID!, listId: ID!): Message!
    }

    type RootMutation {
        createUser(userInput: userInput): User!
        updateUser(userInput: userUpdateInput): User!

        createWorkspace(workspaceInput: workspaceInput): Workspace!
        updateWorkspace(workspaceInput: workspaceInput): Workspace!

        createBoard(boardInput: boardInput): Board!
        updateBoard(boardInput: boardInput): Board!
        createList(listInput: listInput): List!
        updateListById(listInput: listInput): List!
        updateBoardLists(listInput: listInput): List!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }


`);
