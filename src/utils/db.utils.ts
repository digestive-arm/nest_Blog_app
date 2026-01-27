import type { FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";

export async function findExistingEntity<T extends ObjectLiteral>(
  repository: Repository<T>,
  where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
): Promise<boolean> {
  return repository.exists({ where });
}
