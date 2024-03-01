import { NestFactory } from '@nestjs/core';
import { setUpSession } from './setting/session/init.session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setUpSession(app);

  await app.listen(3000);
}
bootstrap();
