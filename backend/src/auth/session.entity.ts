import { ISession } from 'connect-typeorm';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Session implements ISession {
  @Index()
  @Column('bigint')
  public expiredAt: number = Date.now();

  @PrimaryColumn('varchar', { length: 255 })
  id: string = '';

  @Column('text')
  public json = '';
}
