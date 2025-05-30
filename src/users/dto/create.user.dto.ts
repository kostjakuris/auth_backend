export class CreateUserDto {
  readonly username: string;
  readonly email: string;
  readonly password: string;
}

export class LoginUserDto {
  readonly email: string;
  readonly password: string;
}

export class ResetPasswordDto {
  readonly password: string;
  readonly token: string;
}

export class ForgotPasswordDto {
  readonly email: string;
}

export class RegenerateTokenDto {
  readonly refreshToken: string;
}