import { categoryEntity } from "src/category/entities/category.entity";
import { Collection, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'decimal' })
  price: number;

  @ManyToOne(() => categoryEntity, (category) => category.products)
  @JoinColumn({name: 'category_id', referencedColumnName: 'id'})
  category: categoryEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}