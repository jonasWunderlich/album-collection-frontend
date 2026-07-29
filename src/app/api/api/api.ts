export * from './albumController.service';
import { AlbumControllerService } from './albumController.service';
export * from './helloController.service';
import { HelloControllerService } from './helloController.service';
export * from './productController.service';
import { ProductControllerService } from './productController.service';
export const APIS = [AlbumControllerService, HelloControllerService, ProductControllerService];
