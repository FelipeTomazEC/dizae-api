export interface AuthorizationService {
  validate(credentials: string): Promise<boolean>;
}
