// graphql schema here
const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type UserRelation {
        userId: User!
        permission: String
        notified: Boolean
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

    type Workspace {
        _id: ID!
        name: String!
        description: String
        createdAt: String!
        updatedAt: String!
        owner: User!
    }

    type Attachment {
        _id: ID!
        name: String!
        path: String!
        createdAt: String!
        updatedAt: String!
    }

    type Activity {
        _id: ID!
        comment: String!
        createdAt: String!
        updatedAt: String!
        userId: User!
        attachments: [Attachment!]!
    }

    type Task {
        _id: ID!
        name: String!
        description: String
        createdAt: String!
        updatedAt: String!
        labels: [String!]!
        attachments: [Attachment!]!
        joiners: [UserRelation!]!
        watchers: [UserRelation!]!
        activities: [Activity!]!
    }

    type List {
        _id: ID!
        name: String!
        tasks: [Task!]!
        users: [UserRelation!]!
        joiners: [UserRelation!]!
        watchers: [UserRelation!]!
    }

    type Board {
        _id: ID!
        name: String!
        description: String
        createdAt: String!
        updatedAt: String!
        owner: User!
        workspaceId: Workspace!
        users: [UserRelation!]!
        lists: [List!]!
    }

    type Message {
        message: String!
    }

    input UserInput {
        email: String!
        username: String!
        password: String!
        avatar: String
        licence: String
        role: String
        name: String
    }

    input UserUpdateInput {
        username: String
        password: String
        avatar: String
        licence: String
        role: String
        name: String
    }

    type AuthData {
        user: User!
        token: String!
    }

    input workspaceInput {
        name: String!
        description: String
        owner: ID!
    }

    input boardInput {
        name: String!
        description: String
        owner: ID!
        workspaceId: ID!
        users: [UserRelation!]!
        lists: [List!]!
    }

    input listInput {
        name: String!
        tasks: [Task!]!
        joiners: [UserRelation!]!
        watchers: [UserRelation!]!
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
        createUser(userInput: UserInput): User!
        updateUser(userInput: UserUpdateInput): User!

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
