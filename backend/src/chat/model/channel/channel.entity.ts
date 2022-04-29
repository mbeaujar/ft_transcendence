import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelUser } from '../channel-user/channel-user.entity';
import { Message } from '../message/message.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: number;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => ChannelUser, (user) => user.channel)
  users: ChannelUser[];

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];
}
