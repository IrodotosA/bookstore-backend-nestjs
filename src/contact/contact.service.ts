import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/contact.schema';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  create(dto: CreateMessageDto) {
    return this.messageModel.create(dto);
  }

  findAll() {
    return this.messageModel.find().sort({ createdAt: -1 });
  }

  async remove(id: string) {
    const deleted = await this.messageModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Message not found');
    return { success: true };
  }
}
