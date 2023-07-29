import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './core/plugins/swagger/swagger';
import { ConfigService } from '@nestjs/config';
import { CustomValidationPipe } from './core/pipes/custom.validation.pipe';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new CustomValidationPipe());

    const configService = app.get(ConfigService);
    const port = configService.get<string>('PORT');

    setupSwagger('Incode-test', app);

    app.listen(3000).then(() => console.log(`Server running on port: ${port}`));
}
bootstrap();
