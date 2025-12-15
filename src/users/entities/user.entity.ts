export class UserEntity {
  constructor(
    public id: number,
    public email: string,
    public password: string,
    public fullname?: string,
    public phone?: number,
    public avatar?: string,
    public teamId?: number,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
