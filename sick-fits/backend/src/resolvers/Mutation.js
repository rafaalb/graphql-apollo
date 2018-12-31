const bcrypt = require('bcryptjs');
const jwt =  require('jsonwebtoken');
const { transport, makeANiceEmail } = require('../mail');
const { randomBytes } = require('crypto');
const { hasPermission } = require('../utils');
const { promisify } = require('util');

const Mutation = {
    async createItem(parent, args, ctx, info) {
      if (!ctx.request.userId) {
        throw new Error('You must be logged in to do that');
      }
      const item = await ctx.db.mutation.createItem({
        data: {
          ...args,
          user:  { // this binds a relation with item and user
            connect: {
              id: ctx.request.userId
            }
          }
        }
      }, info);

      return item;
    },
    updateItem(parent, args, ctx, info) {
      // first take a copy of the updates
      const updates = { ...args };
      // remove the ID from the updates
      delete updates.id;
      // run the update method
      return ctx.db.mutation.updateItem(
        {
          data: updates,
          where: {
            id: args.id,
          },
        },
        info
      );
    },
    async deleteItem(parent, args, ctx, info) {
      const where = { id: args.id };
      const item = await ctx.db.query.item({ where }, `{ id
      title}`);

      return ctx.db.mutation.deleteItem({
        where,
      }, info);
    },
    async signup(parent, args, ctx, info) {
      args.email = args.email.toLowerCase();
      const password = await bcrypt.hash(args.password, 10);

      const user = await ctx.db.mutation.createUser({
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] }
        },
      }, info);
      const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
      ctx.response.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });
      return user;
    },
    async signin(parent, { email, password }, ctx, info) {
      const user = await ctx.db.query.user({ where: { email }});
      if (!user) throw new Error('No such user found for email');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');

      const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
      ctx.response.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });
      return user;
    },
    async signout(parent, args, ctx, info) {
      ctx.response.clearCookie('token');
      return { message: 'Logout Successful' };
    },
    async requestReset(parent, args, ctx, info) {
      const user = await ctx.db.query.user({
        where: { email: args.email }
      });
      if (!user) throw new Error('No such user found for email');

      const resetToken = (await promisify(randomBytes)(20)).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
      const response = await ctx.db.mutation.updateUser({
        where: { email: args.email },
        data: { resetToken, resetTokenExpiry }
      });
      console.log(response);
      // const mailRes = await transport.sendMail({
      //   from: 'wes@wesbos.com',
      //   to: user.email,
      //   subject: 'Your Password Reset Token',
      //   html: makeANiceEmail(`Your Password Reset Token is here!
      //   \n\n
      //   <a href="${process.env
      //     .FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
      // });
      return { message: 'Token sent' };
    },
    async resetPassword(parent, args, ctx, info) {
      // 1. check if the passwords match
      if (args.password !== args.confirmPassword) {
        throw new Error('Your passwords don\'t match');
      }
      // 2. check if its a legit token
      // 3. check if its expired
      const [user] = await ctx.db.query.users({
        where: {
          resetToken: args.resetToken,
          resetTokenExpiry_gte: Date.now() - 3600000
        }
      });
      if (!user) {
        throw new Error('this token is either expired or doesn\'t exist');
      }
      // 4. hash their new password
      const password = await bcrypt.hash(args.password, 10);
      // 5. save the new password to the user and remove old reset token fields
      const updatedUser = await ctx.db.mutation.updateUser({
        where: { email: user.email },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
          password
        }
      });
      // 6. generate jwt
      const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
      // 7. set the jwt cookie
      ctx.response.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365
      });
      // 8. returns the new user
      return updatedUser;
    },
    async updatePermissions(parent, args, ctx, info) {
      // check if user has permissions to update
      if (!ctx.request.userId) {
        throw new Error('You must be logged in');
      }
      hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
      console.log(args)
      const user = await ctx.db.mutation.updateUser({
        where: { id: args.userId },
        data: {
          permissions: { set: args.permissions }
        }
      }, info);
      return user;
    }
};

module.exports = Mutation;
