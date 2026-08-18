import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ValidationErrorDto } from 'src/exceptions/dto/validation-error.dto';

import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/CreateAlbumDto';
import { PaginatedAlbumsDto } from './dto/paginated-albums.dto';
import { Album } from './schemas/album.schema';

@ApiTags('Albums (User Albums)')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @ApiOperation({
    summary:
      'Get a paginated list of albums, optionally filtered by search query',
  })
  @ApiOkResponse({
    description: 'Albums for the requested page, plus the total count',
    type: PaginatedAlbumsDto,
  })
  @Get()
  getAll(
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('query', new DefaultValuePipe('')) query: string,
  ) {
    return this.albumService.getAll(query, count, offset);
  }

  @ApiOperation({ summary: 'Get a single album by id' })
  @ApiOkResponse({ description: 'Album found', type: Album })
  @ApiResponse({
    status: 404,
    description: 'Album with the given id was not found',
  })
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.albumService.getOne(id);
  }

  @ApiOperation({ summary: 'Create a new album with a picture' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'Album successfully created and saved to the database',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: 'Validation error, or picture file is missing',
    type: ValidationErrorDto,
  })
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  create(
    @UploadedFiles()
    files: { picture?: Express.Multer.File[] },
    @Body() dto: CreateAlbumDto,
  ) {
    const [picture] = files.picture ?? [];

    if (!picture) {
      throw new BadRequestException('picture is required');
    }
    return this.albumService.create(dto, picture);
  }

  @ApiOperation({
    summary:
      'Update an album by id (picture file is optional and replaces the old one only if provided)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Album successfully updated',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: ValidationErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Album with the given id was not found',
  })
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  update(
    @Param('id') id: string,
    @UploadedFiles()
    files: { picture?: Express.Multer.File[] },
    @Body() dto: CreateAlbumDto,
  ) {
    const [picture] = files.picture ?? [];
    return this.albumService.update(id, dto, picture);
  }

  @ApiOperation({ summary: 'Delete an album by id' })
  @ApiOkResponse({ description: 'Album successfully deleted' })
  @ApiResponse({
    status: 404,
    description: 'Album with the given id was not found',
  })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.albumService.delete(id);
  }
}
