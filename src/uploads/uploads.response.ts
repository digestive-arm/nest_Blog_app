import { Expose, Type } from 'class-transformer';
import { ApiPropertyWritable } from 'src/modules/swagger/swagger.writable.decorator';

export class UploadResponse {
  @Expose()
  @ApiPropertyWritable({
    example: 'uploads/nsrgnsepsdfnadvnfdnv',
  })
  public_id: string;
  @Expose()
  @ApiPropertyWritable({
    example: 'secure url of your image',
  })
  secure_url: string;
}

export class UploadMultipleResponse {
  @Expose()
  @ApiPropertyWritable({ type: [UploadResponse] })
  @Type(() => UploadResponse)
  data: UploadResponse[];
}
