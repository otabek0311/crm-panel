import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BotModule } from './bot/bot.module';
import { PaymentModule } from './payment/payment.module';
import { AttendanceModule } from './attendance/attendance.module';
import { GroupModule } from './group/group.module';
import { TeacherModule } from './teacher/teacher.module';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true}),    
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    UserModule,
    AuthModule,
    StudentModule,
    BotModule,
    PaymentModule,
    AttendanceModule,
    GroupModule,
    TeacherModule,
    StaffModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
