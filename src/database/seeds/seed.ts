import { dataSource } from '../data-source';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/comman/types';
import { Role } from 'src/modules/roles/entities/role.entity';

async function seed() {
  await dataSource.initialize();

  const userRepo = dataSource.getRepository(Role);

  const existing = await userRepo.count();
  if (existing > 0) {
    console.log('Users already exist, skipping seeding.');
    return;
  }

  const hashedAdminPassword = await bcrypt.hash('admin', 10);

  await userRepo.save([
    userRepo.create({
      name: 'Admin',
      username: 'admin',
      role: UserRole.ADMIN,
      password: hashedAdminPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
  ]);

  console.log('Seeding complete.');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
});
