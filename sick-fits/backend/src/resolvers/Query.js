const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
//   async items(parent, args, ctx, info) {
//       const items = await ctx.db.query.items();
//       return items;
//   }
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me: (parent, args, ctx, info) => {
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info);
  },
  users: (parent, args, ctx, info) => {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in');
    }
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    return ctx.db.query.users({}, info);
  },
  order: async (parent, args, ctx, info) => {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in')
    }
    const order = await ctx.db.query.order({
      where: { id: args.id }
    }, info)
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error('You cant see this buddd')
    }
    return order;
  },
  orders: async (parent, args, ctx, info) => {
    // 1. Check user is logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to access orders')
    }
    // 2. Check user has permission to view orders
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');
    // 3. fetch orders from user
    const orders = await ctx.db.query.orders({
      where: {
        user: { id: ctx.request.userId }
      }
    }, info)

    if (!hasPermissionToSeeOrder) {
      throw new Error('You cant see this budd')
    }

    return orders;
  }
};

module.exports = Query;
