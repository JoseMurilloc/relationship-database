import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class RemoveColumnNameToOrdersProducts1612277543607
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders_products', 'name');
    await queryRunner.dropColumn('orders_products', 'email');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'email',
        type: 'varchar',
      }),
    );
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'name',
        type: 'varchar',
      }),
    );
  }
}
