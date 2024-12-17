import { Migration } from '@mikro-orm/migrations';

export class Migration20241214124443 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "role" ("id" text not null, "name" text not null, "permissions" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "role_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_role_deleted_at" ON "role" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "role" cascade;');
  }

}
