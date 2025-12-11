import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true}),    

    MongooseModule.forRoot(process.env.MONGO_URI as string), StudentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
