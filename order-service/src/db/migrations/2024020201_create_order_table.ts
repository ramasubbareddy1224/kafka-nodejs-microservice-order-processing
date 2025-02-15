import { Log } from '../../utils';

exports.up = function (knex) {
    try {
        Log.info('2024020201_create_order_table - migration up');
        return knex.schema.createTable('orders', function (table) {
            table.increments('id').primary();
            table.string('customer_name').notNullable();
            table.integer('product_id').notNullable();
            table.integer('quantity').notNullable();
            table.decimal('total_amount', 10, 2).notNullable();
            table.string('status').notNullable();
            table.string('idempotency_key').notNullable().unique();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
    } catch (error) {
        console.log('2024020201_create_order_table - migration up', error);
        Log.error('2024020201_create_order_table - migration up', error);
        throw error;

    }
};

exports.down = function (knex) {
    Log.info('2024020201_create_order_table - migration down');
    return knex.schema.dropTable('orders');
};
