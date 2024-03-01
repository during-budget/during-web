import { Controller, Get } from '@nestjs/common';
import { TestService } from '@service/test.service';

@Controller()
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('/test')
  getHello(): string {
    return this.testService.getHello();
  }

  @Get('/test/config')
  getConfig(): object {
    return this.testService.getConfig();
  }
}
