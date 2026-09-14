import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'E-posta veya Kullanıcı Adı', type: 'text' },
        password: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Gerekli alanları doldurun.');
        }

        const identifier = credentials.identifier as string;
        const password = credentials.password as string;

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { username: identifier },
            ],
          },
          include: {
            userRoles: {
              include: { role: true },
            },
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('Geçersiz bilgiler.');
        }

        const isValid = await bcrypt.compare(password, user.hashedPassword);

        if (!isValid) {
          throw new Error('Geçersiz bilgiler.');
        }

        return {
          id: user.id,
          username: user.username,
          name: user.username,
          email: user.email,
          image: user.image,
          roles: user.userRoles.map((r: { role: { name: string } }) => r.role.name),
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string }).username;
        token.roles = (user as { roles?: string[] }).roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as { username?: string }).username = token.username as string;
        (session.user as unknown as { roles?: string[] }).roles = token.roles as string[];
      }
      return session;
    },
  },
  pages: {
    signIn: '/giris',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
