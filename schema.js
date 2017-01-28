import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} from 'graphql';

import Db from './db';

const Post = new GraphQLObjectType({
  name: 'Posts',
  description: 'This represents posts',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve(post) {
        return post.id;
      },
    },
    title: {
      type: GraphQLString,
      resolve(post) {
        return post.title;
      },
    },
    content: {
      type: GraphQLString,
      resolve(post) {
        return post.content;
      },
    },
    person: {
      type: Person,
      resolve(post) {
        return post.getPerson();
      },
    },
  }),
});

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'This represents a person',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve(person) {
        return person.id;
      },
    },
    firstName: {
      type: GraphQLString,
      resolve(person) {
        return person.firstName;
      },
    },
    lastName: {
      type: GraphQLString,
      resolve(person) {
        return person.lastName;
      },
    },
    email: {
      type: GraphQLString,
      resolve(person) {
        return person.email;
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve(person) {
        return person.getPosts();
      },
    },
  }),
});

const query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields: () => ({
    people: {
      type: new GraphQLList(Person),
      args: {
        id: {
          type: GraphQLInt,
        },
        email: {
          type: GraphQLString,
        },
      },
      resolve(root, args) {
        return Db.models.person.findAll({ where: args });
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve(root, args) {
        return Db.models.post.findAll({ where: args });
      },
    },
  }),
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to create and update stuff',
  fields() {
    return {
      addPerson: {
        type: Person,
        args: {
          firstName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          email: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve(_, args) {
          return Db.models.person.create({
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email.toLowerCase(),
          });
        },
      },
      addPost: {
        type: Post,
        args: {
          personId: {
            type: new GraphQLNonNull(GraphQLInt),
          },
          title: {
            type: new GraphQLNonNull(GraphQLString),
          },
          content: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve(_, args) {
          return Db.models.post.create({
            title: args.title,
            content: args.content,
            personId: args.personId,
          });
        },
      },
    };
  },
});

const Schema = new GraphQLSchema({
  query,
  mutation,
});

export default Schema;
