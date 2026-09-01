// Plain interface, not a class-validator DTO: input is already validated once,
// at the api-gateway edge, before it ever reaches this service over TCP.
export interface CreateUserDto {
  readonly email: string;
  readonly name: string;
  readonly password: string;
}
