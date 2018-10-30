import { Category } from '../models/category.model';

export const CATEGORIES: Category[] = [
  {
    categoryID: 1,
    categoryName: 'categories.emergency',
    iconName: 'ambulance',
    useFilter: false
  },
  {
    categoryID: 2,
    categoryName: 'categories.healthcare',
    iconName: 'user-md',
    useFilter: false
  },
  {
    categoryID: 3,
    categoryName: 'categories.social',
    iconName: 'group',
    useFilter: false
  },
  {
    categoryID: 4,
    categoryName: 'categories.sport',
    iconName: 'futbol-o',
    useFilter: false
  },
  {
    categoryID: 5,
    categoryName: 'categories.art',
    iconName: 'paint-brush',
    useFilter: false
  },
  {
    categoryID: 6,
    categoryName: 'categories.environment',
    iconName: 'leaf',
    useFilter: false
  },
  {
    categoryID: 7,
    categoryName: 'categories.other',
    iconName: 'ellipsis-h',
    useFilter: false
  }
];
