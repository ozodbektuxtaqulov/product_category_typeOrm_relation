import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { categoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(categoryEntity)
    private categoryRepository: Repository<categoryEntity>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryRepository.create(createCategoryDto);
      return this.categoryRepository.save(category);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryRepository.find({
        select: ['id', 'name', 'products'],
        order: { createdAt: 'DESC' },
        relations: ['products'],
      });
      return categories;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        select: ['id', 'name', 'products'],
        relations: ['products'],
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return category;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        select: ['id', 'name', 'products'],
        relations: ['products'],
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      const updatedCategory = this.categoryRepository.create({
        ...category,
        ...updateCategoryDto,
      });

      await this.categoryRepository.save(updatedCategory);
      const updateCategory = await this.categoryRepository.findOne({
        where: { id },
        select: ['id', 'name', 'products'],
        relations: ['products'],
      });
      return updateCategory;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        select: ['id', 'name', 'products'],
        relations: ['products'],
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      await this.categoryRepository.delete({ id });
      return { message: 'success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
