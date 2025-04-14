import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export const Auth = (type: string) => UseGuards(AuthGuard(type))
