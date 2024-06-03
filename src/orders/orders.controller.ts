import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Res,
  HttpStatus,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/roles.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
// import { FileDetails } from './schemas/file.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Get('waitingApprove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getWaitingOrders(@Res() res: Response) {
    try {
      const orders = await this.ordersService.getWaitingOrders();
      return res.status(200).json(orders);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: error.message });
      }
    }
  }
  @Get(':hash')
  async findOrderByHash(@Param('hash') hash: string, @Res() res: Response) {
    try {
      const order = await this.ordersService.findOrderByHash(hash);
      return res.status(200).json({ order });
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: error.message });
      }
    }
  }
  // @Get(':hash/status')
  // async findOrderByHash(@Param('hash') hash: string, @Res() res: Response) {
  //   try {
  //     const order = await this.ordersService.findOrderByHash(hash);
  //     return res.status(200).json({ order });
  //   } catch (error) {
  //     if (error.status === HttpStatus.NOT_FOUND) {
  //       return res
  //         .status(HttpStatus.NOT_FOUND)
  //         .json({ message: error.message });
  //     } else {
  //       return res
  //         .status(HttpStatus.BAD_REQUEST)
  //         .json({ message: error.message });
  //     }
  //   }
  // }
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const hash = req.body.hash;
          console.log(req.body);

          if (!hash) {
            return cb(new BadRequestException('Hash not provided'), null);
          }
          const uploadPath = join(__dirname, '../../uploads', hash);
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createOrder(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const fileDetails =
      files.files?.map((file) => ({
        name: file.originalname,
        size: file.size,
        path: file.path,
      })) || [];

    return this.ordersService.create(createOrderDto, fileDetails);
  }
  @Patch(':hash/close')
  async closeOrder(@Param('hash') hash: string, @Res() res: Response) {
    try {
      const message = await this.ordersService.closeOrder(hash);
      return res.status(200).json({ message });
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: error.message });
      }
    }
  }
  @Patch(':hash/accept')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const hash = req.params.hash;
          if (!hash) {
            return cb(new BadRequestException('Hash not provided'), null);
          }
          const uploadPath = join(__dirname, '../../uploads', hash);
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async acceptOrder(
    @Param('hash') hash: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileDetails = {
      name: file.originalname,
      size: file.size,
      path: file.path,
    };

    return this.ordersService.acceptOrder(hash, fileDetails);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  getAllOrders() {
    return this.ordersService.findAll();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('approved')
  getApprovedOrders() {
    return this.ordersService.getApprovedOrders();
  }
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  // @Get('waitingApprove')
  // getWaitingOrders() {
  //   return this.ordersService.getWaitingOrders();
  // }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id/approve')
  async confirmOrder(@Param('id') id: string) {
    return this.ordersService.approveOrder(id);
  }
}
