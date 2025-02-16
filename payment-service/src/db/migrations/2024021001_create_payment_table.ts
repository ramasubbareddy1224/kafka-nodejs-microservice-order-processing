import { Log } from '../../utils';

exports.up = function (knex) {
    try {
        Log.info('2024021001_create_payment_table - migration up');
        return knex.schema.createTable('payments', function (table) {
            table.increments('id').primary();
            table.integer('order_id').notNullable();
            table.string('status').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
    } catch (error) {
        console.log('2024021001_create_payment_table - migration up', error);
        Log.error('2024021001_create_payment_table - migration up', error);
        throw error;

    }
};

exports.down = function (knex) {
    Log.info('2024021001_create_payment_table - migration down');
    return knex.schema.dropTable('payments');
};
