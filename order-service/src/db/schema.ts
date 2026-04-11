import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull()
}

export const orders = pgTable('orders', {
    id: uuid().primaryKey().$defaultFn(() => uuidv7()),
    customer: uuid('customer').references(() => customers.id).notNull(),
    shippingAddress: uuid('shipping_address').references(() => addresses.id),
    billingAddress: uuid('billing_address').references(() => addresses.id),

    ...timestamps

})

export const customers = pgTable('customers', {
    id: uuid().primaryKey().$defaultFn(() => uuidv7()),
    firstName: varchar('first_name').notNull(),
    lastName: varchar('last_name').notNull(),
    email: varchar('email').notNull(),
    phone: varchar('phone'),

    ...timestamps
});

export const addresses = pgTable('addresses', {
    id: uuid().primaryKey().$defaultFn(() => uuidv7()),
    addressLine1: varchar('address_line1'),
    addressLine2: varchar('address_line2'),
    city: varchar('city'),
    state: varchar('state'),
    country: varchar('country'),
    zip: varchar('zip'),
    email: varchar('email'),

    ...timestamps
});