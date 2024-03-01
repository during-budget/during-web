import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import _testConfig from '@config/testConfig';
import _dbConfig from '@config/dbConfig';

@Injectable()
export class TestService {
  constructor(
    @Inject(_testConfig.KEY) private testConfig: ConfigType<typeof _testConfig>,
    @Inject(_dbConfig.KEY) private dbConfig: ConfigType<typeof _dbConfig>,
  ) {}

  getHello(): string {
    return 'hello';
  }

  getConfig(): object {
    return { testConfig: this.testConfig, dbConfig: this.dbConfig };
  }
}
