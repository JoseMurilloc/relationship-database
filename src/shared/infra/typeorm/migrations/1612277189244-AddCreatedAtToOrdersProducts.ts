import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddCreatedAtToOrdersProducts1612277189244
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders_products', 'created_at');
  }
}
