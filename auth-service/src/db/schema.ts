import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull()
}

export const users = pgTable('users', {
    id: uuid().primaryKey().$defaultFn(() => uuidv7()),
    firstName: varchar('first_name').notNull(),
    lastName: varchar('last_name').notNull(),
    email: varchar('email').unique().notNull(),
    password: varchar('password'),

    ...timestamps
});

