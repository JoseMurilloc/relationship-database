import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class RemoveColumnEmaiilToProducts1612270449196
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('products', 'email');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'email',
        type: 'varchar',
      }),
    );
  }
}
