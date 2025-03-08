import { UserRole } from '../../users/enums/role.enum';

export interface TokenPayload {
  id: number;
  role: UserRole;
}
