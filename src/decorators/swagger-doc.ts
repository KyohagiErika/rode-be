import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

const SwaggerDocumentation = (
  summary: string,
  okDescription: string,
  badRequestDescription: string,
  type: Type,
) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ description: okDescription, type }),
    ApiBadRequestResponse({ description: badRequestDescription }),
  );
};

export default SwaggerDocumentation;
