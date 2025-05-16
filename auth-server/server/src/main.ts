import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AuthModule);
	const config = new DocumentBuilder()
		.setTitle('Auth Service')
		.setDescription('Auth Service API')
		.setVersion('0.0.1')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
